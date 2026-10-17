package com.lifedesk.calendar;

import com.lifedesk.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Table(
        name = "google_calendar_credentials",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_calendar_credential_user",
                        columnNames = "user_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoogleCalendarCredential {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Column(name = "google_email")
    private String googleEmail;
    @Lob
    @Column(name = "access_token", nullable = false, columnDefinition = "TEXT")
    private String accessToken;
    @Lob
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;
    @Column(name = "access_token_expires_at")
    private LocalDateTime accessTokenExpiresAt;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
