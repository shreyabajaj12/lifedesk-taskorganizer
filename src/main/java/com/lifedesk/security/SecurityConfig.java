package com.lifedesk.security;

import com.resend.Resend;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
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

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, OAuth2SuccessHandler oAuth2SuccessHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
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
                        .successHandler(oAuth2SuccessHandler))
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
                List.of("http://localhost:5173")
        );
        configuration.setAllowedMethods(
                List.of("GET","POST","PUT","DELETE","OPTIONS")
        );
        configuration.setAllowedHeaders(
                List.of("*")
        );
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
