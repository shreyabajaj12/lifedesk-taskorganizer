package com.lifedesk.task.daily;

import com.lifedesk.task.dto.TaskResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequestMapping("/api/daily-plans")
@RestController
public class DailyPlanController {

    private final DailyPlanService dailyPlanService;

    public DailyPlanController(DailyPlanService dailyPlanService) {
        this.dailyPlanService = dailyPlanService;
    }

//    @GetMapping("/today")
//    public ResponseEntity<List<TaskResponse>>getTodayPlan(Authentication authentication){
//        String email=authentication.getName();
//
////        DailyPlan dailyPlan =dailyPlanService.getOrCreateTodayPlan(email);
//
//        return ResponseEntity.ok( dailyPlanService.getTodayTasks(email));
//    }
    @GetMapping("/{date}")
    public ResponseEntity<List<TaskResponse>> getTasksForDate(
            @PathVariable LocalDate date,
            Authentication authentication
    ) {
        String email = authentication.getName();

        return ResponseEntity.ok(
                dailyPlanService.getTasksForDate(email, date)
        );
    }

//    @PostMapping("/today/tasks/{taskId}")
//    public ResponseEntity<DailyPlanTask> addTaskToToday(
//            @PathVariable String taskId,
//            Authentication authentication
//    ) {
//        String email = authentication.getName();
//
//        DailyPlanTask dailyPlanTask =
//                dailyPlanService.addTaskToToday(email, taskId);
//
//        return ResponseEntity.ok(dailyPlanTask);
//    }
    @PostMapping("/{date}/tasks/{taskId}")
    public ResponseEntity<DailyPlanTask>addTaskToPlan(@PathVariable LocalDate date, @PathVariable String taskId , Authentication authentication){
        String email=authentication.getName();
        DailyPlanTask dailyPlanTask =dailyPlanService.addTaskToPlan(email,taskId,date);
        return ResponseEntity.ok(dailyPlanTask);
    }
    @DeleteMapping("/{date}/tasks/{taskId}")
    public ResponseEntity<Void> removeTaskFromPlan(
            @PathVariable LocalDate date,
            @PathVariable String taskId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        dailyPlanService.removeTaskFromPlan(
                email,
                date,
                taskId
        );

        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{date}/analytics")
    public ResponseEntity<DailyPlanAnalyticsResponse> getPlanAnalytics(@PathVariable LocalDate date, Authentication authentication){
        String email =authentication.getName();
        return ResponseEntity.ok(
                dailyPlanService.getPlanAnalytics(email,date)
        );
    }
}
