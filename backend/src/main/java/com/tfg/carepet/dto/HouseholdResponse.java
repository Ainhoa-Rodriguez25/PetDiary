package com.tfg.carepet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdResponse {

    private Long id;
    private String name;
    private Long createdByUserId;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
