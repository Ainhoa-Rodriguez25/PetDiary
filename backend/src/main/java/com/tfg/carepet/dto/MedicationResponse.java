package com.tfg.carepet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationResponse {

    private Long id;
    private Long petId;
    private String name;
    private String dosage;
    private String frequency;
    private String timeOfDay;
    private String secondTime;
    private String thirdTime;
    private String startDate;
    private String endDate;
    private String notes;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
