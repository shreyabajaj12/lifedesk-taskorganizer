package com.lifedesk.task.controller;

import com.lifedesk.task.TaskPriority;
import com.lifedesk.task.TaskStatus;
import com.lifedesk.task.dto.*;
import com.lifedesk.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication
            ){
        String email =authentication.getName();
        TaskResponse response=taskService.createTask(request,email);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            Authentication authentication){
        String email =authentication.getName();

        return ResponseEntity.ok(taskService.getTasks(email,search,priority,status,sort));
    }
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable String id,Authentication authentication){
        String email =authentication.getName();
        return ResponseEntity.ok(taskService.getTask(id,email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable String id, @Valid @RequestBody UpdateTaskRequest request,Authentication authentication){
        String email =authentication.getName();
        TaskResponse response =taskService.updateTask(id,request,email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id, Authentication authentication){
        String email =authentication.getName();
        taskService.deleteTask(id,email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics")
    public ResponseEntity<TaskAnalyticsResponse> getTaskAnalytics(Authentication authentication){
        String email =authentication.getName();

        TaskAnalyticsResponse response=taskService.getTaskAnalytics(email);
        System.out.println(response);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics/productivity")
    public ResponseEntity<List<ProductivityHistoryResponse>> getProductivityHistory(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                taskService.getProductivityHistory(email)
        );
    }
}
