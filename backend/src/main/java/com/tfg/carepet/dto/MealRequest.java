package com.tfg.carepet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealRequest {

    @NotNull(message = "El ID de la mascota es obligatorio")
    private Long petId;

    @NotBlank(message = "La cantidad de comidas por dia es obligatoria")
    private String mealsPerDay;

    @NotBlank(message = "La hora de la primera comida es obligatoria")
    private String firstTime;

    private String secondTime;

    private String thirdTime;

    private String fourthTime;

    private String notes;
}
