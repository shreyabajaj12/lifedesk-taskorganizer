package com.lifedesk.task.dto;

import com.lifedesk.task.TaskDifficulty;
import com.lifedesk.task.TaskPriority;
import com.lifedesk.task.TaskStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Builder
public class TaskResponse {
    private String id;
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskDifficulty difficulty;
    private String category;
    private Integer estimatedMinutes;
    private LocalDateTime deadline;
    private TaskStatus status;
    private Integer progress;
    private LocalDateTime createdAt;
}
