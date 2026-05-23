package com.tfg.carepet.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationLogRequest {

    //@NotNull(message = "El Id del medicamento es obligatorio")
    private Long medicationId;

    private String givenAt;

    private String notes;
}
