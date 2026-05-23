package com.tfg.carepet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationResponse {

    private Long id;
    private Long householdId;
    private String householdName;
    private Long invitedByUserId;
    private String invitedByUserName;
    private String invitedUserEmail;
    private String roleOffered;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}
