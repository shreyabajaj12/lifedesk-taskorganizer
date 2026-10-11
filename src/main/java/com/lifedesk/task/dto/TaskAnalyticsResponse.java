package com.lifedesk.task.dto;

import com.lifedesk.task.TaskPriority;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Builder
@Data
public class TaskAnalyticsResponse {
    private long totalTasks;
    private long todoTasks;
    private long inProgressTasks;
    private long completedTasks;
    private int overallProgress;

    private Map<TaskPriority,Long> priorityDistribution;
    private Map<String,Long> categoryDistribution;
    private long overdueTasks;
    private long dueToday;
    private long upcomingTasks;
}
