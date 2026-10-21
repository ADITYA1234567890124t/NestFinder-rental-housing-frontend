package com.rentalhousing.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequestDTO {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    private Long propertyId;

    @NotBlank(message = "Message content is required")
    private String content;
}
