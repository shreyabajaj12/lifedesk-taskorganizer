package com.lifedesk.calendar;

import jakarta.servlet.http.HttpServletRequest;
import org.jspecify.annotations.Nullable;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;

@Component
public class GoogleCalendarAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {

    private final DefaultOAuth2AuthorizationRequestResolver delegate;

    public GoogleCalendarAuthorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository
    ) {
        this.delegate = new DefaultOAuth2AuthorizationRequestResolver(
                clientRegistrationRepository,
                "/oauth2/authorization"
        );
    }

    @Override
    public @Nullable OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        OAuth2AuthorizationRequest authorizationRequest=delegate.resolve(request);
        String uri =request.getRequestURI();
        boolean calendarRequest=uri.endsWith("/oauth2/authorization/google-calendar");
        return customize(authorizationRequest, calendarRequest);
    }

    @Override
    public @Nullable OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
        OAuth2AuthorizationRequest authorizationRequest=delegate.resolve(request,clientRegistrationId);
        boolean calendarRequest="google-calendar".equals(clientRegistrationId);
        return customize(authorizationRequest,calendarRequest);
    }
    private OAuth2AuthorizationRequest customize(OAuth2AuthorizationRequest authorizationRequest, boolean calendarRequest){
        if (authorizationRequest == null || !calendarRequest) {
            return authorizationRequest;
        }
        return OAuth2AuthorizationRequest.from(authorizationRequest)
                .additionalParameters(parameters ->{
                    parameters.put("access_type","offline");
                    parameters.put("prompt","consent");
                }).build();
    }
}
