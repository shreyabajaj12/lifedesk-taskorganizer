package com.lifedesk.calendar;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.auth.oauth2.GoogleCredentials;
import com.lifedesk.calendar.dto.CreateCalendarEventRequest;
import com.lifedesk.task.Task;
import com.lifedesk.task.TaskRepository;
import com.lifedesk.user.User;
import com.lifedesk.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "LifeDesk";
    private static final ZoneId ZONE = ZoneId.of("Asia/Kolkata");
    private final GoogleCalendarCredentialRepository credentialRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public GoogleCalendarService(
            GoogleCalendarCredentialRepository credentialRepository,
            TaskRepository taskRepository, UserRepository userRepository) {
        this.credentialRepository = credentialRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Event createEvent(CreateCalendarEventRequest request, String lifeDeskEmail)
            throws Exception {

        User user =userRepository.findByEmail(lifeDeskEmail)
                .orElseThrow(()->new IllegalArgumentException("LifeDesk user not found"));

        GoogleCalendarCredential savedCredential=credentialRepository.findByUser_Id(user.getId())
                .orElseThrow(()->new IllegalArgumentException("Please connect Google Calendar first"));

        String clientId=System.getenv("GOOGLE_CLIENT_ID");
        String clientSecret=System.getenv("GOOGLE_CLIENT_SECRET");

        if(clientId==null || clientId.isBlank() || clientSecret==null || clientSecret.isBlank()){
            throw new IllegalAccessException("Google OAuth client configuration is missing");
        }

        GoogleCredential googleCredential =
                new GoogleCredential.Builder()
                        .setTransport(
                                GoogleNetHttpTransport.newTrustedTransport())
                        .setJsonFactory(GsonFactory.getDefaultInstance())
                        .setClientSecrets(clientId, clientSecret)
                        .build();

        googleCredential.setAccessToken(
                savedCredential.getAccessToken());

        if (savedCredential.getRefreshToken() != null
                && !savedCredential.getRefreshToken().isBlank()) {
            googleCredential.setRefreshToken(
                    savedCredential.getRefreshToken());
        }

        LocalDateTime expiresAt =
                savedCredential.getAccessTokenExpiresAt();

        boolean tokenNeedsRefresh =
                expiresAt == null
                        || !expiresAt.isAfter(LocalDateTime.now().plusSeconds(60));

        if (tokenNeedsRefresh) {
            if (savedCredential.getRefreshToken() == null
                    || savedCredential.getRefreshToken().isBlank()) {
                throw new IllegalStateException(
                        "Google access token is expired or expiring, "
                                + "and no refresh token is saved. "
                                + "Reconnect Google Calendar.");
            }
            if (!googleCredential.refreshToken()) {
                throw new IllegalStateException(
                        "Google token refresh failed. "
                                + "Please reconnect Google Calendar.");
            }
            savedCredential.setAccessToken(
                    googleCredential.getAccessToken());

            if (googleCredential.getExpirationTimeMilliseconds() != null) {
                savedCredential.setAccessTokenExpiresAt(
                        java.time.Instant.ofEpochMilli(
                                        googleCredential
                                                .getExpirationTimeMilliseconds())
                                .atZone(ZONE)
                                .toLocalDateTime());
            }
            credentialRepository.save(savedCredential);
        }

        Calendar calendar = new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                googleCredential)
                .setApplicationName(APPLICATION_NAME)
                .build();
        LocalDateTime startTime = request.startTime();
        LocalDateTime endTime = startTime.plusDays(1);

        Event event = new Event()
                .setSummary(request.title())
                .setDescription(request.description())
                .setStart(new EventDateTime()
                        .setDateTime(new com.google.api.client.util.DateTime(
                                Date.from(startTime.atZone(ZONE).toInstant())))
                        .setTimeZone(ZONE.getId()))
                .setEnd(new EventDateTime()
                        .setDateTime(new com.google.api.client.util.DateTime(
                                Date.from(endTime.atZone(ZONE).toInstant())))
                        .setTimeZone(ZONE.getId()));

        return calendar.events()
                .insert("primary", event)
                .execute();
    }
}