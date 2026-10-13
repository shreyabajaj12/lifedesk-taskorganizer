package com.lifedesk.calendar;

import com.google.api.services.calendar.model.Event;
import com.lifedesk.calendar.dto.CreateCalendarEventRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/calendar/events")
public class GoogleCalendarEventController {

    private final GoogleCalendarService googleCalendarService;
    private static final Logger log =
            LoggerFactory.getLogger(GoogleCalendarEventController.class);

    public GoogleCalendarEventController(GoogleCalendarService googleCalendarService) {
        this.googleCalendarService = googleCalendarService;
    }
    @PostMapping
    public ResponseEntity<?> createEvent(@Valid @RequestBody CreateCalendarEventRequest request, Authentication authentication){
        if(authentication==null || !authentication.isAuthenticated() || authentication.getName().isBlank()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error","please log in first"));
        }
        try {
            Event event=googleCalendarService.createEvent(
                    request,
                    authentication.getName()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "message","Calendar event created successfully",
                            "eventId", event.getId(),
                            "eventLink", event.getHtmlLink()
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
        catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));

        }
        catch (Exception e) {
            log.error("Failed to create Google Calendar event", e);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error",
                            "Unable to create Google Calendar event"
                    ));
        }

    }
}
