package com.lifedesk.auth.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
@Service
public class OtpService {

    private final SecureRandom random =new SecureRandom();
    public String generateOtp(){
        int otp =10000+random.nextInt(90000);
        return String.valueOf(otp);
    }
}
