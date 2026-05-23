package com.tfg.carepet.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationRequest {

    @NotNull(message = "El ID de la mascota es obligatorio")
    private Long petId;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "La dosis es obligatoria")
    private String dosage;

    @NotBlank(message = "La frecuencia es obligatoria")
    private String frequency;

    @NotBlank(message = "La hora de la toma es obligatoria")
    private String timeOfDay;

    private String secondTime;

    private String thirdTime;

    @NotBlank(message = "El día de inicio es obligatorio")
    private String startDate;

    private String endDate;

    private String notes;
}
