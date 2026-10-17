package com.lifedesk.ai;

import com.lifedesk.task.dto.TaskResponse;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
@Service
public class AiTaskTools {
    private final AiContextService aiContextService;

    public AiTaskTools(AiContextService aiContextService) {
        this.aiContextService = aiContextService;
    }

    @Tool(description = """
            Retrieve the authenticated user's LifeDesk tasks.
            Use this when answering question about their tasks,
            deadlines, priorities, completion status, workload, 
            or what they should focus on.
            """)
    public List<TaskResponse> getMyTasks() throws AccessDeniedException {
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
