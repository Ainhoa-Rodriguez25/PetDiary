package com.tfg.carepet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "household_invitations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "household_id", nullable = false)
    private Long householdId;

    @Column(name = "invited_by_user_id", nullable = false)
    private Long invitedByUserId;

    @Column(name = "invited_user_email", nullable = false, length = 255)
    private String invitedUserEmail;

    @Column(name = "role_offered", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private HouseholdMember.Role roleOffered;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Status status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    // ENUM para estado invitación
    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}
