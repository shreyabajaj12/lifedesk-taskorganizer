package com.lifedesk.ai;

import com.lifedesk.task.dto.TaskResponse;
import com.lifedesk.task.service.TaskService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiContextService {
    private final TaskService taskService;

    public AiContextService(TaskService taskService) {
        this.taskService = taskService;
    }
    @Cacheable(cacheNames = "userTasks",key = "#email")
    public List<TaskResponse> getUserTasks(String email){
        return taskService.getTasks(
                email,
                null,
                null,
                null,
                "deadline"
        );
    }
}
