package com.lifedesk.task.specification;

import com.lifedesk.task.Task;
import com.lifedesk.task.TaskPriority;
import com.lifedesk.task.TaskStatus;
import com.lifedesk.user.User;
import org.springframework.data.jpa.domain.Specification;

import java.util.Locale;

public class TaskSpecification {
    public static Specification<Task> belongToUser(User user){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user"),user);
    }
    public static Specification<Task> hasSearch(String search){
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")),"%"+search.toLowerCase()+"%");
    }
    public static Specification<Task> hasPriority(TaskPriority priority){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("priority"),priority);
    }
    public static Specification<Task> hasStatus(TaskStatus status){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"),status);
    }
}
