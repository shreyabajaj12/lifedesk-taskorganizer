package com.lifedesk.auth.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final Resend resend;


    public EmailService(Resend resend) {
        this.resend =resend;
    }

    public void sendOtp(String email, String otp) throws ResendException {
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("LifeDesk <onboarding@resend.dev>")
                .to(email)
                .subject("LifeDesk Login OTP")
                .html("""
                        <h2>LifeDesk Login</h2>
                        <p>Your verification code is:</p>
                        <h1>%s</h1>
                        <p>This OTP will expire in 5 minutes.</p>
                        """.formatted(otp))
                .build();
        resend.emails().send(params);
    }
}
