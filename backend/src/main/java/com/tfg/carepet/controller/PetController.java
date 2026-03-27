package com.tfg.carepet.controller;

import com.tfg.carepet.dto.PetRequest;
import com.tfg.carepet.dto.PetResponse;
import com.tfg.carepet.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    // Crear una mascota
    @PostMapping
    public ResponseEntity<?> createPet(@Valid @RequestBody PetRequest request) {
        try {
            PetResponse pet = petService.createPet(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(pet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Listar mascotas por hogar
    @GetMapping
    public ResponseEntity<List<PetResponse>> getPets(
            @RequestParam Long householdId
    ) {
        List<PetResponse> pets = petService.getPetsByHousehold(householdId);
        return ResponseEntity.ok(pets);
    }

    // Obtener una mascota por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPetById(@PathVariable Long id) {
        try {
            PetResponse pet = petService.getPetById(id);
            return ResponseEntity.ok(pet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Actualizar mascota
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(
            @PathVariable Long id,
            @Valid @RequestBody PetRequest request
    ) {
        try {
            PetResponse pet = petService.updatePet(id, request);
            return ResponseEntity.ok(pet);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar mascota
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        try {
            petService.deletePet(id);
            return ResponseEntity.ok("Mascota eliminada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
