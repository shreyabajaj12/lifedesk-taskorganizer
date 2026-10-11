package com.lifedesk.task.daily;

import com.lifedesk.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyPlanRepository extends JpaRepository<DailyPlan,String> {
    Optional<DailyPlan> findByUserAndPlanDate(
            User user,
            LocalDate planDate
    );
}
