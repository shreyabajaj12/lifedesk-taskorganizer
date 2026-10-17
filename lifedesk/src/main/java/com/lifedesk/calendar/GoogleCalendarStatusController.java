package com.lifedesk.calendar;

import com.lifedesk.user.User;
import com.lifedesk.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
@RequestMapping("/api/calendar")
public class GoogleCalendarStatusController {
    private final GoogleCalendarCredentialRepository credentialRepository;
    private final UserRepository userRepository;

    public GoogleCalendarStatusController(GoogleCalendarCredentialRepository credentialRepository, UserRepository userRepository) {
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
    }
    @GetMapping("/status")
    public ResponseEntity<Map<String,Boolean>> getStatus(Authentication authentication){
        if(authentication==null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("connected",false));
        }
        User user =userRepository.findByEmail(authentication.getName())
                .orElse(null);
        if(user==null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("connected",false));
        }
        boolean connected =
                credentialRepository.existsByUser_Id(user.getId());

        return ResponseEntity.ok(Map.of("connected", connected));
    }
}
