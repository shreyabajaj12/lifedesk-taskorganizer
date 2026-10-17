package com.lifedesk.calendar;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GoogleCalendarCredentialRepository extends JpaRepository<GoogleCalendarCredential,String> {
    Optional<GoogleCalendarCredential> findByUser_Id(String userId);

    Optional<GoogleCalendarCredential> findByUser_Email(String email);

    boolean existsByUser_Id(String userId);

    void deleteByUser_Id(String userId);
}
