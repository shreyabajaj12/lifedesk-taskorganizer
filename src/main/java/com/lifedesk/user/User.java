package com.lifedesk.user;

import com.lifedesk.common.Provider;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String email;
    String password;
    @Enumerated(EnumType.STRING)
    Provider provider;
}
