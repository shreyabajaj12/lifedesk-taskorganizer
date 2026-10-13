package com.lifedesk.calendar;

import com.lifedesk.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class GoogleCalendarConnectController {
    public static final String CALENDAR_LINK_USER_EMAIL= "CALENDAR_LINK_USER_EMAIL";
    private final JwtService jwtService;

    public GoogleCalendarConnectController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/connect/start")
    public ResponseEntity<Map<String,String>> startConnection(HttpServletRequest request, Authentication authentication){

        String authHeader =request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please log in first"));
        }
        try {
            String token=authHeader.substring(7);
            String email=jwtService.extractEmail(token);
            if (email == null || email.isBlank() || !email.contains("@")) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Invalid LifeDesk user token"));
            }
            HttpSession session = request.getSession(true);
            session.setAttribute(CALENDAR_LINK_USER_EMAIL, email);

            return ResponseEntity.ok(Map.of(
                    "authorizationUrl",
                    "http://localhost:8080/oauth2/authorization/google-calendar"
            ));
        }
        catch (Exception e){
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid or expired login token"));
        }
    }
}
