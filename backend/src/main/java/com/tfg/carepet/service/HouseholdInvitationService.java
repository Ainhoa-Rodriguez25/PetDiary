package com.tfg.carepet.service;

import com.tfg.carepet.dto.InvitationResponse;
import com.tfg.carepet.dto.InviteUserRequest;
import com.tfg.carepet.model.Household;
import com.tfg.carepet.model.HouseholdInvitation;
import com.tfg.carepet.model.HouseholdMember;
import com.tfg.carepet.repository.HouseholdInvitationRepository;
import com.tfg.carepet.repository.HouseholdMemberRepository;
import com.tfg.carepet.repository.HouseholdRepository;
import com.tfg.carepet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HouseholdInvitationService {

    private final HouseholdInvitationRepository invitationRepository;
    private final HouseholdMemberRepository memberRepository;
    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;

    // Crear invitación
    @Transactional
    public InvitationResponse inviteUser(Long householdId, Long inviteByUserId, InviteUserRequest request) {
        // Verificar que invitado sea OWNER o ADMIN
        HouseholdMember inviter = memberRepository.findByHouseholdIdAndUserId(householdId, inviteByUserId).orElseThrow(() -> new RuntimeException("No eres miembro de este hogar"));

        if (inviter.getRole() == HouseholdMember.Role.MEMBER) {
            throw new RuntimeException("Solo propietarios y administradores pueden invitar");
        }

        // Verificar si invitado ya es miembro
        userRepository.findByEmail(request.getInvitedUserEmail())
                .ifPresent(user -> {
                    boolean isMember = memberRepository.existsByHouseholdIdAndUserId(householdId, user.getId());
                    if (isMember) {
                        throw new RuntimeException("Este usuario ya es miembro del hogar");
                    }
                });

        // Verificar que NO exista invitación pendiente
        boolean existsPending = invitationRepository.existsByHouseholdIdAndInvitedUserEmailAndStatus(householdId, request.getInvitedUserEmail(), HouseholdInvitation.Status.PENDING);

        if (existsPending) {
            throw new RuntimeException("Ya existe una invitación pendiente para este email");
        }

        // Crear invitación
        HouseholdInvitation invitation = new HouseholdInvitation();
        invitation.setHouseholdId(householdId);
        invitation.setInvitedByUserId(inviteByUserId);
        invitation.setInvitedUserEmail(request.getInvitedUserEmail());
        invitation.setRoleOffered(HouseholdMember.Role.valueOf(request.getRoleOffered()));
        invitation.setMessage(request.getMessage());
        invitation.setStatus(HouseholdInvitation.Status.PENDING);

        HouseholdInvitation savedInvitation = invitationRepository.save(invitation);

        // Buscar household para respuesta
        Household household = householdRepository.findById(householdId).orElseThrow(() -> new RuntimeException("Hogar no encontrado"));

        return convertToInvitationResponse(savedInvitation, household);
    }

    // Buscar todas las invitaciones pendientes para un email
    public List<InvitationResponse> getPendingInvitations(String userEmail) {
        // Buscar invitaciones
        List<HouseholdInvitation> invitations = invitationRepository.findByInvitedUserEmailAndStatus(userEmail, HouseholdInvitation.Status.PENDING);

        return invitations.stream()
                .map(invitation -> {
                    Household household = householdRepository.findById(invitation.getHouseholdId()).orElse(null);

                    return convertToInvitationResponse(invitation, household);
                })
                .collect(Collectors.toList());
    }

    // Aceptar invitación
    @Transactional
    public void acceptInvitation(Long invitationId, Long userId) {
        // Buscar invitaciones pendientes
        HouseholdInvitation invitation = invitationRepository.findByIdAndStatus(invitationId, HouseholdInvitation.Status.PENDING).orElseThrow(() -> new RuntimeException("Invitación no encontrada o ya procesada"));

        // Buscar usuario que acepta
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que email del usuario coincide con el de la invitación
        if (!user.getEmail().equals(invitation.getInvitedUserEmail())) {
            throw new RuntimeException("Esta invitación no es para el email indicado");
        }

        // Crear miembro en el hogar
        HouseholdMember member = new HouseholdMember();
        member.setHouseholdId(invitation.getHouseholdId());
        member.setUserId(userId);
        member.setRole(invitation.getRoleOffered());

        memberRepository.save(member);

        // Actualizar invitación a ACCEPTED
        invitation.setStatus(HouseholdInvitation.Status.ACCEPTED);
        invitation.setAcceptedAt(LocalDateTime.now());

        invitationRepository.save(invitation);
    }

    // Rechazar invitación
    @Transactional
    public void rejectedInvitation(Long invitationId, Long userId) {
        // Buscar invitaciones pendientes
        HouseholdInvitation invitation = invitationRepository.findByIdAndStatus(invitationId, HouseholdInvitation.Status.PENDING).orElseThrow(() -> new RuntimeException("Invitación no encontrada o ya procesada"));

        // Buscar usuario que rechaza
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que email del usuario coincide con el de la invitación
        if (!user.getEmail().equals(invitation.getInvitedUserEmail())) {
            throw new RuntimeException("Esta invitación no es para el email indicado");
        }

        // Actualizar invitación a REJECTED
        invitation.setStatus(HouseholdInvitation.Status.REJECTED);
        invitation.setRejectedAt(LocalDateTime.now());

        invitationRepository.save(invitation);
    }

    // Obtener lista de las invitaciones de un hogar
    public List<InvitationResponse> getInvitationsByHousehold(Long householdId) {
        // Obtener invitaciones
        List<HouseholdInvitation> invitations = invitationRepository.findByHouseholdId(householdId);

        Household household = householdRepository.findById(householdId).orElse(null);

        return invitations.stream()
                .map(inv -> convertToInvitationResponse(inv, household))
                .collect(Collectors.toList());
    }

    private InvitationResponse convertToInvitationResponse(HouseholdInvitation invitation, Household household) {
        InvitationResponse response = new InvitationResponse();

        response.setId(invitation.getId());
        response.setHouseholdId(invitation.getHouseholdId());
        response.setHouseholdName(household != null ? household.getName() : null);
        response.setInvitedByUserId(invitation.getInvitedByUserId());

        userRepository.findById(invitation.getInvitedByUserId())
                .ifPresent(user -> response.setInvitedByUserName(user.getName()));

        response.setInvitedUserEmail(invitation.getInvitedUserEmail());
        response.setRoleOffered(invitation.getRoleOffered().name());
        response.setMessage(invitation.getMessage());
        response.setStatus(invitation.getStatus().name());
        response.setCreatedAt(invitation.getCreatedAt());

        return response;
    }
}
