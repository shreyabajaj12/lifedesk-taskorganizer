package com.lifedesk.auth.dto;

import com.lifedesk.common.Provider;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private Provider provider;
}
