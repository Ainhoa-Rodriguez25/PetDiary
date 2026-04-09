package com.tfg.carepet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WalkResponse {

    private Long id;
    private Long petId;
    private Long walkedByUserId;
    private String walkedByUserName;
    private LocalDateTime walkedAt;
    private Integer duration;
    private String notes;
    private LocalDateTime createdAt;
}
