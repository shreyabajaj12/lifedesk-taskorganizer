package com.lifedesk.task.daily;

import com.lifedesk.task.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DailyPlanTaskRepository extends JpaRepository<DailyPlanTask,String> {
    List<DailyPlanTask> findByDailyPlan(DailyPlan dailyPlan);

    Optional<DailyPlanTask> findByDailyPlanAndTask(
            DailyPlan dailyPlan,
            Task task
    );

    void deleteByDailyPlanAndTask(
            DailyPlan dailyPlan,
            Task task
    );
}
