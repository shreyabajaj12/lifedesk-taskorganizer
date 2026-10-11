package com.lifedesk.task.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ProductivityHistoryResponse {
    private LocalDate date;
    private long completedTasks;
}
