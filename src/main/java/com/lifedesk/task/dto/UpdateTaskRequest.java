package com.lifedesk.task.dto;

import com.lifedesk.task.TaskDifficulty;
import com.lifedesk.task.TaskPriority;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class UpdateTaskRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;
    private String description;
    @NotNull(message = "Priority is required")
    private TaskPriority priority;
    @NotNull(message = "Difficulty is required")
    private TaskDifficulty difficulty;
    @NotNull(message = "Difficulty is required")
    private String category;
    @NotNull(message = "Estimated time is required")
    @Positive(message = "Estimated time must be greater than 0")
    private Integer estimatedMinutes;
    private LocalDateTime deadline;
    @NotNull(message = "Progress is required")
    @Min(value = 0, message = "Progress cannot be less than 0")
    @Max(value = 100, message = "Progress cannot exceed 100")
    private Integer progress;
}
