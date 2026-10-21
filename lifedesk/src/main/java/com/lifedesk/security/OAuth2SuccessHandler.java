package com.lifedesk.security;

import com.lifedesk.common.Provider;
import com.lifedesk.config.AppUrlConfig;
import com.lifedesk.user.User;
import com.lifedesk.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AppUrlConfig appUrlConfig;


    public OAuth2SuccessHandler(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder, AppUrlConfig appUrlConfig) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.appUrlConfig = appUrlConfig;
    }

    public void onAuthenticationSuccess(HttpServletRequest request
    , HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oauthUser=(OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name= oauthUser.getAttribute("name");

        User user=userRepository.findByEmail(email)
                .orElseGet(()->{
                    User newUser=User.builder()
                            .name(name)
                            .email(email)
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .provider(Provider.GOOGLE)
                            .build();
                    return userRepository.save(newUser);
                });
        String token=jwtService.generateToken(user.getEmail());

        System.out.println("OAUTH SUCCESS HANDLER CALLED");
        System.out.println("EMAIL: " + user.getEmail());
        System.out.println("TOKEN GENERATED");

        String redirectUrl =
                appUrlConfig.getFrontendUrl()+"/oauth2/success?token=" + token;

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);    }
}
