package com.rentalhousing.serviceImpl;

import com.rentalhousing.dto.request.MessageRequestDTO;
import com.rentalhousing.dto.response.MessageResponseDTO;
import com.rentalhousing.entity.Message;
import com.rentalhousing.entity.Property;
import com.rentalhousing.entity.User;
import com.rentalhousing.mapper.MessageMapper;
import com.rentalhousing.mapper.UserMapper;
import com.rentalhousing.repository.MessageRepository;
import com.rentalhousing.repository.PropertyRepository;
import com.rentalhousing.repository.UserRepository;
import com.rentalhousing.service.MessageService;
import com.rentalhousing.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final UserMapper userMapper;
    private final MessageMapper messageMapper;

    /* ------------------------------------------------ */
    /* Send Message                                     */
    /* ------------------------------------------------ */

    @Override
    @Transactional
    public MessageResponseDTO sendMessage(
            MessageRequestDTO request,
            String senderEmail
    ) {

        User sender =
                userService.getUserEntityByEmail(
                        senderEmail
                );

        User receiver =
                userService.getUserEntityById(
                        request.getReceiverId()
                );

        Property property = null;

        if (request.getPropertyId() != null) {

            property =
                    propertyRepository
                            .findById(
                                    request.getPropertyId()
                            )
                            .orElse(null);
        }

        Message message =
                Message.builder()
                        .sender(sender)
                        .receiver(receiver)
                        .property(property)
                        .content(request.getContent())
                        .isRead(false)
                        .build();

        Message savedMessage =
                messageRepository.save(message);

        log.info(
                "Message sent from {} to {}",
                sender.getEmail(),
                receiver.getEmail()
        );

        return messageMapper.toDTO(
                savedMessage
        );
    }

    /* ------------------------------------------------ */
    /* Get Conversation                                 */
    /* ------------------------------------------------ */

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponseDTO> getConversation(
            Long otherUserId,
            String currentUserEmail
    ) {

        User currentUser =
                userService.getUserEntityByEmail(
                        currentUserEmail
                );

        User otherUser =
                userService.getUserEntityById(
                        otherUserId
                );

        List<Message> messages =
                messageRepository.findConversation(
                        currentUser.getId(),
                        otherUser.getId()
                );

        return messages.stream()
                .map(messageMapper::toDTO)
                .toList();
    }

    /* ------------------------------------------------ */
    /* Get Conversations List                           */
    /* ------------------------------------------------ */

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getConversationList(
            String userEmail
    ) {

        User currentUser =
                userService.getUserEntityByEmail(
                        userEmail
                );

        List<Long> partnerIds =
                messageRepository
                        .findConversationPartnerIds(
                                currentUser.getId()
                        );

        List<Map<String, Object>> conversations =
                new ArrayList<>();

        for (Long partnerId : partnerIds) {

            User partner =
                    userRepository
                            .findById(partnerId)
                            .orElse(null);

            if (partner == null) {
                continue;
            }

            Map<String, Object> conversation =
                    new HashMap<>();

            /* ------------------------------ */
            /* Partner Info                   */
            /* ------------------------------ */

            conversation.put(
                    "partner",
                    userMapper.toResponseDTO(
                            partner
                    )
            );

            /* ------------------------------ */
            /* Unread Count                   */
            /* ------------------------------ */

            long unreadCount =
                    messageRepository
                            .countBySenderIdAndReceiverIdAndIsReadFalse(
                                    partnerId,
                                    currentUser.getId()
                            );

            conversation.put(
                    "unreadCount",
                    unreadCount
            );

            /* ------------------------------ */
            /* Last Message                   */
            /* ------------------------------ */

            List<Message> conversationMessages =
                    messageRepository.findConversation(
                            currentUser.getId(),
                            partnerId
                    );

            if (!conversationMessages.isEmpty()) {

                Message lastMessage =
                        conversationMessages.get(
                                conversationMessages.size() - 1
                        );

                conversation.put(
                        "lastMessage",
                        messageMapper.toDTO(
                                lastMessage
                        )
                );
            }

            conversations.add(
                    conversation
            );
        }

        /* -------------------------------- */
        /* Sort latest message first        */
        /* -------------------------------- */

        conversations.sort((a, b) -> {

            MessageResponseDTO msgA =
                    (MessageResponseDTO)
                            a.get("lastMessage");

            MessageResponseDTO msgB =
                    (MessageResponseDTO)
                            b.get("lastMessage");

            if (msgA == null && msgB == null)
                return 0;

            if (msgA == null)
                return 1;

            if (msgB == null)
                return -1;

            return msgB.getSentAt()
                    .compareTo(
                            msgA.getSentAt()
                    );
        });

        return conversations;
    }

    /* ------------------------------------------------ */
    /* Mark As Read                                     */
    /* ------------------------------------------------ */

    @Override
    @Transactional
    public void markAsRead(
            Long senderId,
            String receiverEmail
    ) {

        User receiver =
                userService.getUserEntityByEmail(
                        receiverEmail
                );

        List<Message> unreadMessages =
                messageRepository
                        .findByReceiverIdAndIsReadFalse(
                                receiver.getId(),
                                Pageable.unpaged()
                        )
                        .getContent();

        unreadMessages.stream()
                .filter(message ->
                        message.getSender()
                                .getId()
                                .equals(senderId)
                )
                .forEach(message ->
                        message.setRead(true)
                );

        messageRepository.saveAll(
                unreadMessages
        );
    }

    /* ------------------------------------------------ */
    /* Get Total Unread Count                           */
    /* ------------------------------------------------ */

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(
            String userEmail
    ) {

        User user =
                userService.getUserEntityByEmail(
                        userEmail
                );

        return messageRepository
                .findByReceiverIdAndIsReadFalse(
                        user.getId(),
                        Pageable.unpaged()
                )
                .getTotalElements();
    }
}