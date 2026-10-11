package com.lifedesk.auth.service;

import com.lifedesk.auth.dto.*;
import com.lifedesk.auth.entity.OtpVerification;
import com.lifedesk.auth.repository.OtpVerificationRepository;
import com.lifedesk.common.Provider;
import com.lifedesk.security.JwtService;
import com.lifedesk.user.User;
import com.lifedesk.user.UserRepository;
import com.resend.core.exception.ResendException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    private final OtpVerificationRepository otpVerificationRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, OtpService otpService, EmailService emailService, OtpVerificationRepository otpVerificationRepository, JwtService jwtService){
        this.passwordEncoder=passwordEncoder;
        this.userRepository=userRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.otpVerificationRepository = otpVerificationRepository;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) throws ResendException {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already registered");
        }
        String otp=otpService.generateOtp();

        OtpVerification verification =OtpVerification.builder()
                .email(request.getEmail())
                .name(request.getName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .attempts(0)
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();
        otpVerificationRepository.save(verification);
        emailService.sendOtp(request.getEmail(),otp);
    }

    public String login(LoginRequest request){

        User user =userRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("Invalid email or password"));
        boolean passwordMatch= passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );
        if(!passwordMatch){
            throw new RuntimeException("Invalid email or password");
        }
        return jwtService.generateToken(user.getEmail());
    }
    public void verifyRegistrationOtp(VerifyOtpRequest request){
        OtpVerification verification=otpVerificationRepository
                .findTopByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(()->
                        new RuntimeException("OTP not found"));

        if(verification.getExpiresAt().isBefore(LocalDateTime.now())){
            throw new RuntimeException("OTP expired");
        }
        if(verification.getAttempts()>=5){
            throw new RuntimeException("Too many OTP attempts");
        }
        verification.setAttempts(verification.getAttempts()+1);

        boolean validOtp=passwordEncoder.matches(
                request.getOtp(),
                verification.getOtpHash()
        );
        if (!validOtp) {
            otpVerificationRepository.save(verification);
            throw new RuntimeException("Invalid OTP");
        }
        User user = User.builder()
                .name(verification.getName())
                .email(verification.getEmail())
                .password(verification.getPasswordHash())
                .provider(Provider.LOCAL)
                .build();

        userRepository.save(user);

        otpVerificationRepository.delete(verification);
    }

    public void resendRegistrationOtp(ResendOtpRequest request) throws ResendException {
        String email=request.getEmail();
        if(userRepository.existsByEmail(email)){
            throw new RuntimeException("Email already registered");
        }
        OtpVerification oldVerification=
                otpVerificationRepository
                        .findTopByEmailOrderByCreatedAtDesc(email)
                        .orElseThrow(()->
                                new RuntimeException("No pending registration found"));
        otpVerificationRepository.delete(oldVerification);

        String otp=otpService.generateOtp();

        OtpVerification newVerification =OtpVerification.builder()
                .email(oldVerification.getEmail())
                .name(oldVerification.getEmail())
                .passwordHash(oldVerification.getPasswordHash())
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .attempts(0)
                .createdAt(LocalDateTime.now())
                .build();
        otpVerificationRepository.save(newVerification);

        emailService.sendOtp(email,otp);
    }

    public UserResponse getCurrentUser(String email){
        User user =userRepository.findByEmail(email)
                .orElseThrow(()->
                        new RuntimeException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .provider(user.getProvider())
                .build();

    }
}

