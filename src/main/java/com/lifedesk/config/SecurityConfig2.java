//package com.lifedesk.config;
//
//import com.resend.Resend;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http){
//        http.
//                csrf(csrf->csrf.disable())
//                .authorizeHttpRequests(auth->auth
//                        .requestMatchers("/api/auth/**").permitAll()
//                        .anyRequest().authenticated());
//        return http.build();
//    }
//   
//
//}
