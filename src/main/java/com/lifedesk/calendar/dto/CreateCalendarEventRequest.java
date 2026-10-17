package com.lifedesk.calendar.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.aspectj.bridge.IMessage;

import java.time.LocalDateTime;

public record CreateCalendarEventRequest(
        @NotBlank(message="Title is required")
        @Size(max=200, message="Title must not exceed 200 characters")
        String title,
        @Size(max=5000, message = "Description must not exceed 5000 characters")
        String description,
        @NotNull(message = "Start time is required")
        LocalDateTime startTime,
        @NotNull(message = "End time is required")
        LocalDateTime endTime
) {
}
