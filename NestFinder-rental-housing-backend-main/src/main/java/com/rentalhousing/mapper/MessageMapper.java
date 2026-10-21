package com.rentalhousing.mapper;

import com.rentalhousing.dto.response.MessageResponseDTO;
import com.rentalhousing.entity.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageMapper {

    private final UserMapper userMapper;

    public MessageResponseDTO toDTO(Message message) {

        if (message == null) {
            return null;
        }

        return MessageResponseDTO.builder()
                .id(message.getId())
                .sender(
                        userMapper.toResponseDTO(
                                message.getSender()
                        )
                )
                .receiver(
                        userMapper.toResponseDTO(
                                message.getReceiver()
                        )
                )
                .propertyId(
                        message.getProperty() != null
                                ? message.getProperty().getId()
                                : null
                )
                .content(message.getContent())
                .read(message.isRead())
                .sentAt(message.getSentAt())
                .build();
    }
}