package com.lifedesk.task.helper;

import com.lifedesk.task.TaskStatus;
import org.springframework.stereotype.Component;

@Component
public class DeriveStatus {
    public TaskStatus deriveStatus(int progress){
        if (progress == 0) {
            return TaskStatus.TODO;
        }

        if (progress == 100) {
            return TaskStatus.COMPLETED;
        }

        return TaskStatus.IN_PROGRESS;
    }
}
