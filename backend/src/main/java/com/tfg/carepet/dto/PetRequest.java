package com.tfg.carepet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetRequest {

    @NotNull(message = "El ID del hogar es obligatorio")
    private Long householdId;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "La especie es obligatoria")
    private String species;

    private Long breedId; // Puede ser null

    private String customBreed;

    private LocalDate birthDate;

    private BigDecimal weight;

    private String gender;

    private String allergies;

    private String medicalNotes;
}
