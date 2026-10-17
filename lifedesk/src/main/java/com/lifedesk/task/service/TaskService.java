package com.lifedesk.task.service;

import com.lifedesk.task.Task;
import com.lifedesk.task.TaskPriority;
import com.lifedesk.task.TaskRepository;
import com.lifedesk.task.TaskStatus;
import com.lifedesk.task.dto.*;
import com.lifedesk.task.helper.DeriveStatus;
import com.lifedesk.task.specification.TaskSpecification;
import com.lifedesk.user.User;
import com.lifedesk.user.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final DeriveStatus taskStatusHelper;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, DeriveStatus taskStatusHelper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskStatusHelper = taskStatusHelper;
    }
    @CacheEvict(cacheNames = "userTasks",key = "#email")
    public TaskResponse createTask(CreateTaskRequest request, String email){
        User user =userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("user not found"));

        Task task =Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .difficulty(request.getDifficulty())
                .category(request.getCategory())
                .estimatedMinutes(request.getEstimatedMinutes())
                .deadline(request.getDeadline())
                .status(TaskStatus.TODO)
                .progress(0)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        Task savedTask = taskRepository.save(task);

        return mapToResponse(savedTask);
    }

    private TaskResponse mapToResponse(Task task) {
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

    public List<TaskResponse> getTasks(String email,String search, TaskPriority priority, TaskStatus status, String sort){
        User user =userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        Specification<Task> specification= TaskSpecification.belongToUser(user);
        if(search !=null && !search.trim().isEmpty()){
            specification = specification.and(TaskSpecification.hasSearch(search.trim()));
        }
        if(priority!=null){
            specification=specification.and(TaskSpecification.hasPriority(priority));
        }
        if(status!=null){
            specification=specification.and(TaskSpecification.hasStatus(status));
        }

        Sort sorting;

        switch (sort.toLowerCase()){
            case "oldest":
                sorting=Sort.by(Sort.Direction.ASC,"createdAt");
                break;
            case "deadline":
                sorting=Sort.by(Sort.Direction.ASC,"deadline");
                break;
            case "newest":
            default:
                sorting=Sort.by(Sort.Direction.DESC,"createdAt");
                break;
        }

        return taskRepository
                .findAll(specification, sorting)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TaskResponse getTask(String id, String email){
        User user =userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User not found"));

        Task task =taskRepository.findByIdAndUser(id,user)
                .orElseThrow(()->new RuntimeException("Task not found"));


        return mapToResponse(task);
    }

    @CacheEvict(cacheNames = "userTasks",key = "#email")
    public TaskResponse updateTask(String id, UpdateTaskRequest request, String email){
        User user=userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));
        Task task =taskRepository.findByIdAndUser(id,user)
                .orElseThrow(()->new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDifficulty(request.getDifficulty());
        task.setCategory(request.getCategory());
        task.setEstimatedMinutes(request.getEstimatedMinutes());
        task.setDeadline(request.getDeadline());
        task.setProgress(request.getProgress());

        TaskStatus newStatus =taskStatusHelper.deriveStatus(request.getProgress());
        task.setStatus(newStatus);
        if (newStatus == TaskStatus.COMPLETED &&
                task.getCompletedAt() == null) {

            task.setCompletedAt(LocalDateTime.now());

        } else if (newStatus != TaskStatus.COMPLETED) {

            task.setCompletedAt(null);
        }
        Task updateTask =taskRepository.save(task);
        return mapToResponse(updateTask);
    }

    @CacheEvict(cacheNames = "userTasks",key = "#email")
    public void deleteTask(String id, String email){

        User user =userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User not found"));
        Task task=taskRepository.findByIdAndUser(id,user)
                .orElseThrow(()-> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }

    public TaskAnalyticsResponse getTaskAnalytics(String email){
        User user= userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User not found"));

        List<Task> tasks= taskRepository.findByUser(user);

        long totalTasks=tasks.size();

        long todoTasks =tasks.stream()
                .filter(task->task.getStatus()==TaskStatus.TODO)
                .count();
        long inProgressTasks =tasks.stream()
                .filter(task->task.getStatus()==TaskStatus.IN_PROGRESS)
                .count();

        long completedTasks = tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                .count();

        int overallProgress = tasks.isEmpty()
                ? 0
                : (int) tasks.stream()
                .mapToInt(Task::getProgress)
                .average()
                .orElse(0);

        Map<TaskPriority,Long>priorityDistribution=tasks.stream()
                .filter(task->task.getStatus() !=TaskStatus.COMPLETED)
                .collect(Collectors.groupingBy(
                        Task::getPriority,
                        Collectors.counting()
                ));
        Map<String, Long> categoryDistribution = tasks.stream()
                .collect(Collectors.groupingBy(
                        Task::getCategory,
                        Collectors.counting()
                ));
        LocalDateTime now=LocalDateTime.now();
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime startOfTomorrow =startOfToday.plusDays(1);

        long overdueTasks = tasks.stream()
                .filter(task -> task.getStatus() != TaskStatus.COMPLETED)
                .filter(task -> task.getDeadline() != null)
                .filter(task -> task.getDeadline().isBefore(now))
                .count();

        long dueToday = tasks.stream()
                .filter(task -> task.getStatus() != TaskStatus.COMPLETED)
                .filter(task -> task.getDeadline() != null)
                .filter(task -> !task.getDeadline().isBefore(startOfToday))
                .filter(task -> task.getDeadline().isBefore(startOfTomorrow))
                .count();

        long upcomingTasks = tasks.stream()
                .filter(task -> task.getStatus() != TaskStatus.COMPLETED)
                .filter(task -> task.getDeadline() != null)
                .filter(task -> !task.getDeadline().isBefore(startOfTomorrow))
                .count();

        TaskAnalyticsResponse temp= TaskAnalyticsResponse.builder()
                .totalTasks(totalTasks)
                .todoTasks(todoTasks)
                .inProgressTasks(inProgressTasks)
                .completedTasks(completedTasks)
                .overallProgress(overallProgress)
                .priorityDistribution(priorityDistribution)
                .categoryDistribution(categoryDistribution)
                .overdueTasks(overdueTasks)
                .dueToday(dueToday)
                .upcomingTasks(upcomingTasks)
                .build();

        return temp;
    }
    public List<ProductivityHistoryResponse> getProductivityHistory(String email){
        User user= userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Map<LocalDate, Long> history = taskRepository.findByUser(user)
                .stream()
                .filter(task -> task.getCompletedAt() != null)
                .collect(Collectors.groupingBy(
                        task -> task.getCompletedAt().toLocalDate(),
                        Collectors.counting()
                ));
        return history.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> ProductivityHistoryResponse.builder()
                        .date(entry.getKey())
                        .completedTasks(entry.getValue())
                        .build())
                .toList();
    }
}
