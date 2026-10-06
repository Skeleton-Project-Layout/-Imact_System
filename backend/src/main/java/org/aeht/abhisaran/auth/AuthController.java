package org.aeht.abhisaran.auth;

import jakarta.validation.Valid;
import org.aeht.abhisaran.auth.dto.AuthResponse;
import org.aeht.abhisaran.auth.dto.LoginRequest;
import org.aeht.abhisaran.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        User user = authService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().getId(),
                "deliveryPointCode", user.getDeliveryPointCode() != null ? user.getDeliveryPointCode() : ""
        ));
    }
}
