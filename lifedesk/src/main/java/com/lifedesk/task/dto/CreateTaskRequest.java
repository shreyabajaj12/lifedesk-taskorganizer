package com.lifedesk.task.dto;

import com.lifedesk.task.TaskDifficulty;
import com.lifedesk.task.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class CreateTaskRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;
    private String description;
    @NotNull(message = "Priority is required")
    private TaskPriority priority;
    @NotNull(message = "Difficulty is required")
    private TaskDifficulty difficulty;
    @NotBlank(message = "Category is required")
    private String category;
    @NotNull(message = "Estimated time is required")
    @Positive(message = "Estimated time must be greater than 0")
    private Integer estimatedMinutes;
    private LocalDateTime deadline;
}
