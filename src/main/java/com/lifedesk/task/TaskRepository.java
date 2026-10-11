package com.lifedesk.task;

import com.lifedesk.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task,String>, JpaSpecificationExecutor<Task> {
    List<Task> findByUser(User user);
    Optional<Task> findByIdAndUser(String Id, User user);
}
