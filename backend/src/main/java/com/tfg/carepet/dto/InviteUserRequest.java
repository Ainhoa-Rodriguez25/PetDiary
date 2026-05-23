package com.tfg.carepet.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteUserRequest {

    @NotBlank(message = "El email del usuario invitado es obligatorio")
    @Email(message = "Email inválido")
    private String invitedUserEmail;

    @NotBlank(message = "El rol es obligatorio")
    private String roleOffered;

    private String message;


}
