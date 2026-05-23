package com.tfg.carepet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "medication_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "medication_id", nullable = false)
    private Long medicationId;

    @Column(name = "given_by_user_id")
    private Long givenByUserId;

    @Column(name = "given_at", nullable = false)
    private LocalDateTime givenAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
