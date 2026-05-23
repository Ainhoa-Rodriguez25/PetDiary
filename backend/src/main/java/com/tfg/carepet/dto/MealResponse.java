package com.tfg.carepet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealResponse {

    private Long id;
    private Long petId;
    private String mealsPerDay;
    private String firstTime;
    private String secondTime;
    private String thirdTime;
    private String fourthTime;
    private String notes;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
