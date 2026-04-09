package com.tfg.carepet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalkRequest {

    @NotNull(message = "El ID de la mascota es obligatorio")
    private Long petId;

    private String walkedAt;

    private String duration;

    private String notes;
}
