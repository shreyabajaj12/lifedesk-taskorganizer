package com.lifedesk.security;

import com.lifedesk.calendar.GoogleCalendarAuthorizationRequestResolver;
import com.lifedesk.calendar.GoogleCalendarOAuth2SuccessHandler;
import com.lifedesk.config.AppUrlConfig;
import com.resend.Resend;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final GoogleCalendarOAuth2SuccessHandler calendarSuccessHandler;
    private final GoogleCalendarAuthorizationRequestResolver
            calendarAuthorizationRequestResolver;
    private final AppUrlConfig appUrlConfig;
    private static final Logger log =
            LoggerFactory.getLogger(SecurityConfig.class);

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, OAuth2SuccessHandler oAuth2SuccessHandler, GoogleCalendarOAuth2SuccessHandler calendarSuccessHandler, GoogleCalendarAuthorizationRequestResolver calendarAuthorizationRequestResolver, AppUrlConfig appUrlConfig) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.calendarSuccessHandler = calendarSuccessHandler;
        this.calendarAuthorizationRequestResolver = calendarAuthorizationRequestResolver;
        this.appUrlConfig = appUrlConfig;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http){
        http
                .csrf(csrf->csrf.disable())
                .cors(cors->{})
                .sessionManagement(session->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth ->auth
                        .requestMatchers("/api/auth/**","/api/test/public","/oauth2/**","/login/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth ->oauth
                        .authorizationEndpoint(endpoint->
                                endpoint.authorizationRequestResolver(
                                        calendarAuthorizationRequestResolver
                                ))
                        .successHandler((request,response,authentication)->{
                    if(authentication instanceof OAuth2AuthenticationToken token
                    && "google-calendar".equals(token.getAuthorizedClientRegistrationId())){
                        calendarSuccessHandler.onAuthenticationSuccess(request, response,authentication);
                    }
                    else{
                        oAuth2SuccessHandler.onAuthenticationSuccess(request, response, authentication);
                    }
        }
        )
                                .failureHandler((request, response, exception)->{
                                    log.error(
                                            "OAuth2 login failed. Request URI: {}. Exception: {}",
                                            request.getRequestURI(),
                                            exception.getMessage(),
                                            exception
                                    );

                                    response.sendRedirect( appUrlConfig.getFrontendUrl() +"/?calendar=oauth_error");
                                })
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );
        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration =new CorsConfiguration();
        configuration.setAllowedOrigins(
                List.of(appUrlConfig.getFrontendUrl())
        );
        configuration.setAllowedMethods(
                List.of("GET","POST","PUT","DELETE","OPTIONS")
        );
        configuration.setAllowedHeaders(
                List.of("*")
        );
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source =new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration);
        return source;
    }
    @Bean
    public AuthenticationEntryPoint apiAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized"
            );
        };
    }

    @Value("${resend.api.key}")
    private String apikey;
    @Bean
    public Resend resendClient(){
        return new Resend(apikey);
    }

    @Value("${jwt.secret}")
    private String secretValue;

    @Value("${jwt.expiration}")
    private long expiration;
}
