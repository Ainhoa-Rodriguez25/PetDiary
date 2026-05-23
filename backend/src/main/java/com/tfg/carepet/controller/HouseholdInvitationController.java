package com.tfg.carepet.controller;

import com.tfg.carepet.dto.AcceptInvitationRequest;
import com.tfg.carepet.dto.InvitationResponse;
import com.tfg.carepet.dto.InviteUserRequest;
import com.tfg.carepet.service.HouseholdInvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/households")
@RequiredArgsConstructor
public class HouseholdInvitationController {

    private final HouseholdInvitationService invitationService;

    // Invitar usuario al hogar
    @PostMapping("/{householdId}/invite")
    public ResponseEntity<?> inviteUser(@PathVariable Long householdId, @RequestParam Long userId, @Valid @RequestBody InviteUserRequest request) {
        try {
            InvitationResponse invitation = invitationService.inviteUser(householdId, userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(invitation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ver invitaciones pendientes del usuario
    @GetMapping("/invitations/pending")
    public ResponseEntity<List<InvitationResponse>> getPendingInvitations(@RequestParam String email) {
        List<InvitationResponse> invitations = invitationService.getPendingInvitations(email);
        return ResponseEntity.ok(invitations);
    }

    // Aceptar invitación
    @PostMapping("/invitations/{invitationId}/accept")
    public ResponseEntity<?> acceptInvitation(@PathVariable Long invitationId, @RequestParam Long userId, @Valid @RequestBody AcceptInvitationRequest request) {
        try {
            if (request.getAccept()) {
                invitationService.acceptInvitation(invitationId, userId);
                return ResponseEntity.ok("Invitación aceptada correctamente");
            } else {
                invitationService.rejectedInvitation(invitationId, userId);
                return ResponseEntity.ok("Invitación rechazada correctamente");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ver invitaciones de un hogar
    @GetMapping("/{householdId}/invitations")
    public ResponseEntity<List<InvitationResponse>> getInvitationsByHousehold(@PathVariable Long householdId) {
        List<InvitationResponse> invitations = invitationService.getInvitationsByHousehold(householdId);
        return ResponseEntity.ok(invitations);
    }
}
