package com.tfg.carepet.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMemberRoleRequest {

    @NotBlank(message = "El nuevo rol es obligatorio")
    private String newRole;
}
