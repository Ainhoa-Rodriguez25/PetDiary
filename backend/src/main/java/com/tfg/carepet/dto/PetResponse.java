package com.tfg.carepet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PetResponse {

    private Long id;
    private Long householdId;
    private String name;
    private String species;
    private BreedResponse breed;
    private String customBreed;
    private LocalDate birthDate;
    private BigDecimal weight;
    private String gender;
    private String allergies;
    private String medicalNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
