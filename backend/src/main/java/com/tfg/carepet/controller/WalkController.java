package com.tfg.carepet.controller;

import com.tfg.carepet.dto.WalkRequest;
import com.tfg.carepet.dto.WalkResponse;
import com.tfg.carepet.service.WalkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/walks")
@RequiredArgsConstructor
public class WalkController {

    private final WalkService walkService;

    // Registrar paseo
    @PostMapping
    public ResponseEntity<?> createWalk(@Valid @RequestBody WalkRequest request) {
        try {
            WalkResponse walk = walkService.createWalk(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(walk);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Listar paseos de una mascota
    @GetMapping
    public ResponseEntity<List<WalkResponse>> getWalksByPet(@RequestParam Long petId) {
        List<WalkResponse> walks = walkService.getWalksByPet(petId);
        return ResponseEntity.ok(walks);
    }

    // Obtener un paseo por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getWalkById(@PathVariable Long id) {
        try {
            WalkResponse walk = walkService.getWalkById(id);
            return ResponseEntity.ok(walk);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar paseo
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWalk(@PathVariable Long id) {
        try {
            walkService.deleteWalk(id);
            return ResponseEntity.ok("Paseo eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener historial de paseos con rango de fechas
    @GetMapping("/history")
    public ResponseEntity<List<WalkResponse>> getWalkHistory(@RequestParam Long petId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<WalkResponse> history = walkService.getWalkHistory(petId, startDate, endDate);
        return ResponseEntity.ok(history);
    }
}
