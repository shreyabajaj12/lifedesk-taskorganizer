package com.lifedesk.ai;

import com.lifedesk.task.dto.TaskResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TaskMcpTools {

    private final AiContextService aiContextService;

    public TaskMcpTools(AiContextService aiContextService) {
        this.aiContextService = aiContextService;
    }

    @McpTool(
            name = "get_my_tasks",
            description = "Retrieve the authenticated user's LifeDesk tasks,"+
                    "including deadlines, priorities, status, difficulty,"+
                    "estimated duration, and category.",
            annotations = @McpTool.McpAnnotations(
                    readOnlyHint = true,
                    destructiveHint = false,
                    idempotentHint = true
            )
    )
    public List<TaskResponse> getMyTask(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AccessDeniedException(
                    "Authentication is required to access tasks."
            );
        }

        return aiContextService.getUserTasks(authentication.getName());
    }
}
