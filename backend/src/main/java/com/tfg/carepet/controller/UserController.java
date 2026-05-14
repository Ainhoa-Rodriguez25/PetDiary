package com.tfg.carepet.controller;

import com.tfg.carepet.dto.ChangePasswordRequest;
import com.tfg.carepet.dto.UpdateProfileRequest;
import com.tfg.carepet.dto.UserProfileResponse;
import com.tfg.carepet.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // Obtener userId del token JWT
    private Long getCurrentUserId() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return Long.parseLong(userDetails.getUsername());
    }

    // Ver perfil
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile() {
        return ResponseEntity.ok(userService.getProfile(getCurrentUserId()));
    }

    // Actualizar nombre
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        try {
            UserProfileResponse response = userService.updateProfile(getCurrentUserId(), request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Cambiar contraseña
    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(getCurrentUserId(), request);
            return ResponseEntity.ok("Contraseña actualizada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
