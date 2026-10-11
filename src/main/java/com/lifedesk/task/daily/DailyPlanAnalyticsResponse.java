package com.lifedesk.task.daily;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DailyPlanAnalyticsResponse {
    private long totalTasks;
    private long completedTasks;
    private long remainingTasks;
    private int progress;
}
