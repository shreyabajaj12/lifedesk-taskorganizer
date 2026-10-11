package com.lifedesk;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.Authenticator;

@RequestMapping("/api/test")
@RestController
public class test {
    @GetMapping("/public")
    public String publicEndpoint(){
        return "Public endpoint work";
    }
    @GetMapping("/private")
    public String privateEndpoint(Authentication authentication){
        return "Hello "+authentication.getName();
    }
}
