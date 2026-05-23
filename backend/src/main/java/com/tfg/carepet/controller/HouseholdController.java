package com.tfg.carepet.controller;

import com.tfg.carepet.dto.HouseholdRequest;
import com.tfg.carepet.dto.HouseholdResponse;
import com.tfg.carepet.dto.MemberResponse;
import com.tfg.carepet.service.HouseholdService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/households")
@RequiredArgsConstructor
public class HouseholdController {

    private final HouseholdService householdService;

    // Crear hogar
    @PostMapping
    public ResponseEntity<?> createHousehold(@RequestParam Long userId, @Valid @RequestBody HouseholdRequest request) {
        try {
            HouseholdResponse household = householdService.createHousehold(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(household);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Listar hogares del usuario
    @GetMapping
    public ResponseEntity<List<HouseholdResponse>> getHouseholdsByUser(@RequestParam Long userId) {
        List<HouseholdResponse> households = householdService.getHouseholdsByUser(userId);
        return ResponseEntity.ok(households);
    }

    // Ver un hogar
    @GetMapping("/{id}")
    public ResponseEntity<?> getHouseholdById(@PathVariable Long id) {
        try {
            HouseholdResponse household = householdService.getHouseholdById(id);
            return ResponseEntity.ok(household);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Actualizar un hogar
    @PutMapping("/{id}")
    public ResponseEntity<?> updateHousehold(@PathVariable Long id, @RequestParam Long userId, @Valid @RequestBody HouseholdRequest request) {
        try {
            HouseholdResponse household = householdService.updateHousehold(id, userId, request);
            return ResponseEntity.ok(household);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar hogar
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHousehold(@PathVariable Long id, @RequestParam Long userId) {
        try {
            householdService.deleteHousehold(id, userId);
            return ResponseEntity.ok("Hogar eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ver miembros del hogar
    @GetMapping("/{id}/members")
    public ResponseEntity<List<MemberResponse>> getHouseholdMembers(@PathVariable Long id) {
        List<MemberResponse> members = householdService.getHouseholdMembers(id);
        return ResponseEntity.ok(members);
    }
}
