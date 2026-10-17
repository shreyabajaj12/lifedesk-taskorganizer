package com.lifedesk.ai;

import com.lifedesk.ai.dto.ChatRequest;
import com.lifedesk.ai.dto.ChatResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {
    private final AiChatService aiChatService;

    public AiChatController(AiChatService aiChatService) {
        this.aiChatService = aiChatService;
    }
    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request, Authentication authentication){
        if(request.message()==null || request.message().isBlank()){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message cannot be empty."
            );
        }
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required."
            );
        }
        AiChatService.ChatResult result=aiChatService.chat(
                authentication.getName(),
                request.message(),
                request.conversationId()
        );
        return new ChatResponse(
                result.reply(),
                result.conversationId()
        );
    }
}