package com.tfg.carepet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealLogResponse {

    private Long id;
    private Long mealId;
    private Long givenByUserId;
    private String givenByUserName;
    private LocalDateTime givenAt;
    private String notes;
    private LocalDateTime createdAt;
}
