package com.lifedesk.auth.controller;

import com.lifedesk.auth.dto.*;
import com.lifedesk.auth.service.AuthService;
import com.lifedesk.auth.service.EmailService;
import com.lifedesk.auth.service.OtpService;
import com.resend.core.exception.ResendException;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.Authenticator;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final EmailService emailService;


    public AuthController(AuthService authService, OtpService otpService, EmailService emailService) {
        this.authService = authService;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) throws ResendException {
        authService.register(request);
        return ResponseEntity.ok("OTP sent successfully");
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request){
        String token =authService.login(request);


        return ResponseEntity.ok(token);
    }

//    @PostMapping("/test-email")
//    public ResponseEntity<String> testEmail(@RequestParam String email) throws ResendException {
//        String otp=otpService.generateOtp();
//        emailService.sendOtp(email,otp);
//        return ResponseEntity.ok("Test OTP email sent");
//    }
    @PostMapping("/verify-registration-otp")
    public ResponseEntity<String> verifyRegistrationOtp(@Valid @RequestBody VerifyOtpRequest request){
        authService.verifyRegistrationOtp(request);
        return  ResponseEntity.ok("Registration Successful");
    }
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@Valid @RequestBody ResendOtpRequest request) throws ResendException {
        authService.resendRegistrationOtp(request);
        return ResponseEntity.ok("New OTP sent successfully");
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication){
        String email =authentication.getName();
        UserResponse user=authService.getCurrentUser(email);
        return ResponseEntity.ok(user);
    }
}
