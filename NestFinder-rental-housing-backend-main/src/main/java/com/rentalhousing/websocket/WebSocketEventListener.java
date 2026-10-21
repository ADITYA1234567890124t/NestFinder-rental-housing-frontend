package com.rentalhousing.websocket;

import com.rentalhousing.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Listens to WebSocket lifecycle events:
 *
 *  - SessionConnectedEvent  → authenticate JWT, store email in session, add to online-users map
 *  - SessionDisconnectEvent → remove from online-users map, broadcast "user offline" event
 *  - SessionSubscribeEvent  → log subscription for debugging
 *
 * Online-presence map: onlineUsers = { sessionId → email }
 * Consumers can inject WebSocketEventListener and call getOnlineUsers() to see who is connected.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final JwtTokenProvider jwtTokenProvider;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Thread-safe map: WebSocket sessionId → user email
     */
    private final Map<String, String> onlineUsers = new ConcurrentHashMap<>();

    /* ------------------------------------------------------------------ */
    /*  CONNECT                                                             */
    /* ------------------------------------------------------------------ */

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();

        String email = resolveEmailFromSession(accessor);

        if (email != null) {
            onlineUsers.put(sessionId, email);

            // Store email in session attributes so other handlers can read it
            if (accessor.getSessionAttributes() != null) {
                accessor.getSessionAttributes().put("email", email);
            }

            log.info("WebSocket CONNECT: user={} sessionId={}", email, sessionId);

            // Notify the user's own queue that connection is established
            Map<String, Object> connectedPayload = new HashMap<>();
            connectedPayload.put("type",      "CONNECTED");
            connectedPayload.put("message",   "WebSocket connection established");
            connectedPayload.put("timestamp", LocalDateTime.now().toString());

            messagingTemplate.convertAndSendToUser(email, "/queue/notifications", connectedPayload);

        } else {
            log.warn("WebSocket CONNECT: unauthenticated session={} — no valid JWT found", sessionId);
        }
    }

    /* ------------------------------------------------------------------ */
    /*  DISCONNECT                                                          */
    /* ------------------------------------------------------------------ */

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();

        String email = onlineUsers.remove(sessionId);

        if (email != null) {
            log.info("WebSocket DISCONNECT: user={} sessionId={}", email, sessionId);

            // Optionally broadcast "user went offline" to a public topic
            // so other clients can update presence indicators
            Map<String, Object> offlinePayload = new HashMap<>();
            offlinePayload.put("type",      "USER_OFFLINE");
            offlinePayload.put("userEmail", email);
            offlinePayload.put("timestamp", LocalDateTime.now().toString());

            messagingTemplate.convertAndSend("/topic/presence", offlinePayload);
        } else {
            log.debug("WebSocket DISCONNECT: unknown sessionId={}", sessionId);
        }
    }

    /* ------------------------------------------------------------------ */
    /*  SUBSCRIBE (debug / logging)                                         */
    /* ------------------------------------------------------------------ */

    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = accessor.getDestination();
        String sessionId   = accessor.getSessionId();
        String email       = onlineUsers.getOrDefault(sessionId, "unknown");

        log.debug("WebSocket SUBSCRIBE: user={} destination={}", email, destination);
    }

    /* ------------------------------------------------------------------ */
    /*  Public API                                                          */
    /* ------------------------------------------------------------------ */

    /**
     * Returns a snapshot of currently connected users.
     * Key = sessionId, Value = email.
     */
    public Map<String, String> getOnlineUsers() {
        return Map.copyOf(onlineUsers);
    }

    /**
     * Returns the set of emails that are currently online.
     */
    public Set<String> getOnlineEmails() {
        return Set.copyOf(onlineUsers.values());
    }

    /**
     * Check if a specific user is currently connected.
     */
    public boolean isUserOnline(String email) {
        return onlineUsers.containsValue(email);
    }

    /* ------------------------------------------------------------------ */
    /*  Helpers                                                             */
    /* ------------------------------------------------------------------ */

    /**
     * Attempt to resolve the authenticated user email from:
     *  1. Spring Security principal on the accessor
     *  2. A "Authorization" native STOMP header (Bearer <token>)
     */
    private String resolveEmailFromSession(StompHeaderAccessor accessor) {

        // 1. Spring Security principal (if JWT filter ran at HTTP-upgrade level)
        if (accessor.getUser() != null) {
            return accessor.getUser().getName();
        }

        // 2. STOMP native header: Authorization: Bearer <jwt>
        String authHeader = accessor.getFirstNativeHeader("Authorization");
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (jwtTokenProvider.validateToken(token)) {
                    return jwtTokenProvider.getEmailFromToken(token);
                }
            } catch (Exception e) {
                log.warn("Invalid JWT in WebSocket CONNECT header: {}", e.getMessage());
            }
        }

        return null;
    }
}
