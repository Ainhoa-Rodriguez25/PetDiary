package com.tfg.carepet.controller;

import com.tfg.carepet.dto.MedicationLogRequest;
import com.tfg.carepet.dto.MedicationLogResponse;
import com.tfg.carepet.dto.MedicationRequest;
import com.tfg.carepet.dto.MedicationResponse;
import com.tfg.carepet.service.MedicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationController {

    private  final MedicationService medicationService;

    // Crear medicamento
    @PostMapping
    public ResponseEntity<?> createMedication(@Valid @RequestBody MedicationRequest request) {
        try {
            MedicationResponse medication = medicationService.createMedication(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(medication);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<MedicationResponse>> getMedicationsByPet(@RequestParam Long petId) {
        List<MedicationResponse> medications = medicationService.getMedicationsByPet(petId);

        return ResponseEntity.ok(medications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicationById(@PathVariable Long id) {
        try {
            MedicationResponse medication = medicationService.getMedicationById(id);
            return ResponseEntity.ok(medication);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedication(@PathVariable Long id, @Valid @RequestBody MedicationRequest request) {
        try {
            MedicationResponse medication = medicationService.updateMedication(id, request);
            return ResponseEntity.ok(medication);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedication(@PathVariable Long id) {
        try {
            medicationService.deleteMedication(id);
            return ResponseEntity.ok("Medicamento eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Resgistrar que se dió toma de medicamento
    @PostMapping("/{id}/log")
    public ResponseEntity<?> logMedication(@PathVariable Long id, @Valid @RequestBody MedicationLogRequest request) {
        try {
            request.setMedicationId(id);

            MedicationLogResponse log = medicationService.logMedication(request);
            return  ResponseEntity.status(HttpStatus.CREATED).body(log);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<MedicationLogResponse>> getMedicationHistory(@PathVariable Long id) {
        List<MedicationLogResponse> history = medicationService.getMedicationHistory(id);
        return ResponseEntity.ok(history);
    }
}
