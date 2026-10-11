package com.lifedesk.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AiChatService {
    private final ChatClient chatClient;
    private final AiTaskTools aiTaskTools;

    public AiChatService(ChatClient.Builder chatClient, AiTaskTools aiTaskTools, ChatMemory chatMemory) {
        this.chatClient = chatClient.defaultAdvisors(
                MessageChatMemoryAdvisor.builder(chatMemory).build()
        )
                .build();
        this.aiTaskTools = aiTaskTools;
    }

    public ChatResult chat(String email,String message, String requestedConversationId){
        String conversationId= requestedConversationId==null
                ||requestedConversationId.isBlank() ?
                UUID.randomUUID().toString():requestedConversationId.trim();

        String memoryKey=email+":"+conversationId;

        String reply = chatClient.prompt()
                .system("""
                        You are LifeDesk, a personal AI productivity assistant.
                        
                                            Help users prioritize tasks, manage their workload,
                                            understand deadlines, and make realistic plans.
                        
                                            When a question depends on the user's actual tasks,
                                            call getMyTasks instead of inventing task information.
                        
                                            Use task priorities, deadlines, estimated durations,
                                            and completion status when making recommendations.
                        
                                            Be practical, supportive, and concise.
                                            Never claim a task is completed unless its status
                                            confirms that it is completed.""")
                .user(message)
                .tools(aiTaskTools)
                .advisors(advisor ->advisor.param(
                        ChatMemory.CONVERSATION_ID,memoryKey
                ))
                .call()
                .content();
        return new ChatResult(reply, conversationId);
    }
    public record ChatResult(String reply, String conversationId){

    }
}
