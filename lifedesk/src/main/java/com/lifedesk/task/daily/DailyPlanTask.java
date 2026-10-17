package com.lifedesk.task.daily;

import com.lifedesk.task.Task;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "daily_plan_tasks",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"daily_plan_id", "task_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyPlanTask {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "daily_plan_id", nullable = false)
    private DailyPlan dailyPlan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
}
