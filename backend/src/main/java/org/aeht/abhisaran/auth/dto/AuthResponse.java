package org.aeht.abhisaran.auth.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private UUID userId;
    private String username;
    private String role;
    private String deliveryPointCode;
}
