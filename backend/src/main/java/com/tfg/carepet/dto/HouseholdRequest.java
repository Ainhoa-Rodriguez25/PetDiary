package com.tfg.carepet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdRequest {

    @NotBlank(message = "El nombre del hogar es obligatorio")
    private String name;

    private String description;
}
