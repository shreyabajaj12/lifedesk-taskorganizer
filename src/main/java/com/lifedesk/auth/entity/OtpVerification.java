package com.lifedesk.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String passwordHash;
    @Column(nullable = false)
    private String otpHash;
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    @Column(nullable = false)
    private int attempts;
    @Column(nullable = false)
    private boolean verified;
    @Column(nullable = false)
    private LocalDateTime createdAt;
}
