package com.lifedesk.task;

import com.lifedesk.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Table(name="tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskDifficulty difficulty;
    @Column(nullable = false)
    private String category;
    @Column(nullable = false)
    private Integer estimatedMinutes;
    private LocalDateTime deadline;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;
    @Column(nullable = false)
    private Integer progress;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    @ManyToOne(fetch= FetchType.LAZY,optional = false)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;
    @Column(name = "google_calendar_event_id")
    private String googleCalendarEventId;
    @Column(name="calendar_synced")
    @Builder.Default
    private Boolean calendarSynced=false;

}
