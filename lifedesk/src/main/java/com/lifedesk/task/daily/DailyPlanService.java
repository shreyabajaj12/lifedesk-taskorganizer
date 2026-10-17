package com.lifedesk.task.daily;

import com.lifedesk.task.Task;
import com.lifedesk.task.TaskRepository;
import com.lifedesk.task.TaskStatus;
import com.lifedesk.task.dto.TaskResponse;
import com.lifedesk.user.User;
import com.lifedesk.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DailyPlanService {

    private final DailyPlanRepository dailyPlanRepository;
    private final DailyPlanTaskRepository dailyPlanTaskRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;


    public DailyPlanService(DailyPlanRepository dailyPlanRepository, DailyPlanTaskRepository dailyPlanTaskRepository, UserRepository userRepository, TaskRepository taskRepository) {
        this.dailyPlanRepository = dailyPlanRepository;
        this.dailyPlanTaskRepository = dailyPlanTaskRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

//    public DailyPlan getOrCreateTodayPlan(String email){
//        User user=userRepository.findByEmail(email)
//                .orElseThrow(()->new RuntimeException("user not found"));
//
//        LocalDate today = LocalDate.now();
//
//        return dailyPlanRepository
//                .findByUserAndPlanDate(user, today)
//                .orElseGet(() -> {
//
//                    DailyPlan dailyPlan = DailyPlan.builder()
//                            .user(user)
//                            .planDate(today)
//                            .build();
//
//                    return dailyPlanRepository.save(dailyPlan);
//                });
//    }

    public DailyPlan getOrCreatePlan(String email, LocalDate date) {

        if (date.isAfter(LocalDate.now())) {
            throw new RuntimeException("Cannot create a plan for a future date");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return dailyPlanRepository
                .findByUserAndPlanDate(user, date)
                .orElseGet(() -> {

                    DailyPlan dailyPlan = DailyPlan.builder()
                            .user(user)
                            .planDate(date)
                            .build();

                    return dailyPlanRepository.save(dailyPlan);
                });
    }

    public DailyPlanTask addTaskToPlan(String email,String taskId,LocalDate date){
        User user=userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User not found"));

        DailyPlan dailyPlan=getOrCreatePlan(email,date);

        Task task =taskRepository.findByIdAndUser(taskId,user)
                .orElseThrow(()->new RuntimeException("Task not found"));

        if(dailyPlanTaskRepository.findByDailyPlanAndTask(dailyPlan,task).isPresent()){
            throw new RuntimeException("Task already exists in today's plan");
        }
        DailyPlanTask dailyPlanTask = DailyPlanTask.builder()
                .dailyPlan(dailyPlan)
                .task(task)
                .build();

        return dailyPlanTaskRepository.save(dailyPlanTask);
    }

//    public List<TaskResponse> getTodayTasks(String email){
//        DailyPlan dailyPlan =getOrCreateTodayPlan(email);
//        return dailyPlanTaskRepository
//                .findByDailyPlan(dailyPlan)
//                .stream()
//                .map(DailyPlanTask::getTask)
//                .map(this::mapToTaskResponse)
//                .toList();
//    }

    public List<TaskResponse> getTasksForDate(
            String email,
            LocalDate date
    ) {
        if (date.isAfter(LocalDate.now())) {
            throw new RuntimeException("Cannot view a future daily plan");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<DailyPlan> dailyPlan =
                dailyPlanRepository.findByUserAndPlanDate(user, date);

        if (dailyPlan.isEmpty()) {
            return List.of();
        }

        return dailyPlanTaskRepository
                .findByDailyPlan(dailyPlan.get())
                .stream()
                .map(DailyPlanTask::getTask)
                .map(this::mapToTaskResponse)
                .toList();
    }

    public void removeTaskFromPlan(String email, LocalDate date,String taskId){
        User user=userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User not found"));

        if(date.isAfter(LocalDate.now())){
            throw new RuntimeException("Cannot modify a future daily plan");
        }
        DailyPlan dailyPlan=dailyPlanRepository.findByUserAndPlanDate(user,date)
                .orElseThrow(()->new RuntimeException("Daily plan not found"));

        Task task=taskRepository.findByIdAndUser(taskId,user).orElseThrow(()->new RuntimeException("Task not found"));
        DailyPlanTask dailyPlanTask =
                dailyPlanTaskRepository
                        .findByDailyPlanAndTask(dailyPlan, task)
                        .orElseThrow(() ->
                                new RuntimeException("Task is not part of this daily plan"));

        dailyPlanTaskRepository.delete(dailyPlanTask);
    }

    private TaskResponse mapToTaskResponse(Task task) {

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .difficulty(task.getDifficulty())
                .category(task.getCategory())
                .estimatedMinutes(task.getEstimatedMinutes())
                .deadline(task.getDeadline())
                .status(task.getStatus())
                .progress(task.getProgress())
                .createdAt(task.getCreatedAt())
                .build();
    }
    public DailyPlanAnalyticsResponse getPlanAnalytics(String email, LocalDate date){
        User user=userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User not found"));
        if(date.isAfter(LocalDate.now())){
            throw new RuntimeException("Cannot view a future daily plan");
        }
        DailyPlan dailyPlan =dailyPlanRepository
                .findByUserAndPlanDate(user,date)
                .orElse(null);
        if(dailyPlan==null){
            return DailyPlanAnalyticsResponse.builder()
                    .totalTasks(0)
                    .completedTasks(0)
                    .remainingTasks(0)
                    .progress(0)
                    .build();
        }
        List<DailyPlanTask>planTasks=dailyPlanTaskRepository.findByDailyPlan(dailyPlan);
        long totalTasks =planTasks.size();
        long completedTasks=planTasks.stream()
                .filter(planTask->planTask.getTask().getStatus()== TaskStatus.COMPLETED)
                .count();
        long remainingTasks =totalTasks-completedTasks;
        int progress= totalTasks==0?0:
                (int)((completedTasks * 100) / totalTasks);

        return DailyPlanAnalyticsResponse.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .remainingTasks(remainingTasks)
                .progress(progress)
                .build();
    }
}
