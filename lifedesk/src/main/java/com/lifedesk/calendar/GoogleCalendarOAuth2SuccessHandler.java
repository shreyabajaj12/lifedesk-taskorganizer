package com.lifedesk.calendar;

import com.lifedesk.calendar.GoogleCalendarCredentialRepository;
import com.lifedesk.user.User;
import com.lifedesk.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Component
public class GoogleCalendarOAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final GoogleCalendarCredentialRepository credentialRepository;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public GoogleCalendarOAuth2SuccessHandler(
            UserRepository userRepository,
            GoogleCalendarCredentialRepository credentialRepository,
            OAuth2AuthorizedClientService authorizedClientService) {

        this.userRepository = userRepository;
        this.credentialRepository = credentialRepository;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        HttpSession session = request.getSession(false);
        System.out.println("=== CALENDAR OAUTH CALLBACK ===");
        System.out.println("Session exists: " + (session != null));
        System.out.println("Authentication type: " + authentication.getClass().getName());
        System.out.println("Principal class: " +
                authentication.getPrincipal().getClass().getName());
        if (session == null) {
            System.out.println("ERROR: Session not found");
            redirectWithStatus(request, response, "error");
            return;
        }

        Object emailAttribute = session.getAttribute(
                GoogleCalendarConnectController.CALENDAR_LINK_USER_EMAIL
        );

        System.out.println("LifeDesk email in session: " + emailAttribute);


        if (!(emailAttribute instanceof String lifeDeskEmail)
                || lifeDeskEmail.isBlank()) {
            redirectWithStatus(request, response, "error");
            return;
        }

        OAuth2AuthenticationToken oauthToken =
                (OAuth2AuthenticationToken) authentication;

        // Ensure this handler is used only for Calendar authorization.
        if (!"google-calendar".equals(
                oauthToken.getAuthorizedClientRegistrationId())) {
            redirectWithStatus(request, response, "error");
            return;
        }

        OAuth2AuthorizedClient authorizedClient =
                authorizedClientService.loadAuthorizedClient(
                        "google-calendar",
                        oauthToken.getName()
                );

        System.out.println(
                "Calendar authorized client found: "
                        + (authorizedClient != null)
        );

        if (authorizedClient == null) {
            redirectWithStatus(request, response, "error");
            return;
        }

        User lifeDeskUser = userRepository.findByEmail(lifeDeskEmail)
                .orElse(null);

        if (lifeDeskUser == null) {
            redirectWithStatus(request, response, "error");
            return;
        }

        OAuth2User googleUser =
                (OAuth2User) oauthToken.getPrincipal();

        String googleEmail = googleUser.getAttribute("email");

        var accessToken = authorizedClient.getAccessToken();
        var refreshToken = authorizedClient.getRefreshToken();

        GoogleCalendarCredential credential =
                credentialRepository.findByUser_Id(lifeDeskUser.getId())
                        .orElseGet(() -> GoogleCalendarCredential.builder()
                                .user(lifeDeskUser)
                                .build());

        credential.setGoogleEmail(googleEmail);
        credential.setAccessToken(accessToken.getTokenValue());

        // Google may not return a refresh token on every authorization.
        // Preserve an existing one if the new response omits it.
        if (refreshToken != null) {
            credential.setRefreshToken(refreshToken.getTokenValue());
        }

        if (accessToken.getExpiresAt() != null) {
            credential.setAccessTokenExpiresAt(
                    LocalDateTime.ofInstant(
                            accessToken.getExpiresAt(),
                            ZoneId.systemDefault()
                    )
            );
        }

        credentialRepository.save(credential);

        session.removeAttribute(
                GoogleCalendarConnectController.CALENDAR_LINK_USER_EMAIL
        );

        redirectWithStatus(request, response, "connected");
    }

    private void redirectWithStatus(
            HttpServletRequest request,
            HttpServletResponse response,
            String status) throws IOException {

        getRedirectStrategy().sendRedirect(
                request,
                response,
                "http://localhost:5173/?calendar=" + status
        );
    }
}