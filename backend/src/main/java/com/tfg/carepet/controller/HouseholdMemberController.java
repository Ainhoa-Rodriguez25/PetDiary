package com.tfg.carepet.controller;

import com.tfg.carepet.dto.UpdateMemberRoleRequest;
import com.tfg.carepet.service.HouseholdMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/households")
@RequiredArgsConstructor
public class HouseholdMemberController {

    private final HouseholdMemberService memberService;

    // Cambiar rol de un miembro
    @PutMapping("/{householdId}/members/{memberId}/role")
    public ResponseEntity<?> updateMemberRole(@PathVariable Long householdId, @PathVariable Long memberId, @RequestParam Long userId, @Valid @RequestBody UpdateMemberRoleRequest request) {
        try {
            memberService.updateMemberRole(householdId, memberId, userId, request);
            return ResponseEntity.ok("Rol actualizado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Expulsar miembro
    @DeleteMapping("/{householdId}/members/{memberId}")
    public ResponseEntity<?> removeMember(@PathVariable Long householdId, @PathVariable Long memberId, @RequestParam Long userId) {
        try {
            memberService.removeMember(householdId,memberId, userId);
            return ResponseEntity.ok("Miembro eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Salir del hogar
    @DeleteMapping("/{householdId}/leave")
    public ResponseEntity<?> leaveHousehold(@PathVariable Long householdId, @RequestParam Long userId) {
        try {
            memberService.leaveHousehold(householdId, userId);
            return ResponseEntity.ok("Has salido del hogar correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
