package com.tfg.carepet.service;

import com.tfg.carepet.dto.UpdateMemberRoleRequest;
import com.tfg.carepet.model.HouseholdMember;
import com.tfg.carepet.repository.HouseholdMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HouseholdMemberService {

    private final HouseholdMemberRepository memberRepository;

    // Actualizar el rol de un miembro
    @Transactional
    public void updateMemberRole(Long householdId, Long memberId, Long userId, UpdateMemberRoleRequest request) {

        // Verificar que user es OWNER
        verifyUserIsOwner(householdId, userId);

        // Buscar miembro a modificar
        HouseholdMember member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Miembro no encontrado"));

        // Verificar si pertenece al hogar
        if (!member.getHouseholdId().equals(householdId)) {
            throw new RuntimeException("Este miembro no pertenece a este hogar");
        }

        // Verificar que NO sea OWNER
        if (member.getRole() == HouseholdMember.Role.OWNER) {
            throw new RuntimeException("No se puede cambiar el rol del propietario");
        }

        // Parsear nuevo rol del miembro
        HouseholdMember.Role newRole = HouseholdMember.Role.valueOf(request.getNewRole());

        // Verificar que no se intente asignar OWNER
        if (newRole == HouseholdMember.Role.OWNER) {
            throw new RuntimeException("No se puede asignar el rol de propietario");
        }

        member.setRole(newRole);
        memberRepository.save(member);
    }

    // Eliminar un miembro del hogar
    @Transactional
    public void removeMember(Long householdId, Long memberId, Long userId) {
        verifyUserIsOwnerOrAdmin(householdId, userId);

        HouseholdMember member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("Miembro no encontrado"));

        // Verificar si pertenece al hogar
        if (!member.getHouseholdId().equals(householdId)) {
            throw new RuntimeException("Este miembro no pertenece a este hogar");
        }

        // Verificar que NO sea OWNER
        if (member.getRole() == HouseholdMember.Role.OWNER) {
            throw new RuntimeException("No se puede expulsar al propietario");
        }

        // Verificar que no sea uno mismo
        if (member.getUserId().equals(userId)) {
            throw new RuntimeException("No puedes expulsarte a ti mismo");
        }

        // Eliminar miembro del hogar
        memberRepository.deleteById(memberId);
    }

    // Opción para que usuario pueda salir del hogar voluntariamente
    @Transactional
    public void leaveHousehold(Long householdId, Long userId) {
        HouseholdMember member = memberRepository.findByHouseholdIdAndUserId(householdId, userId).orElseThrow(() -> new RuntimeException("No eres miembro de este hogar"));

        // Verificar que NO sea OWNER
        if (member.getRole() == HouseholdMember.Role.OWNER) {
            throw new RuntimeException("El propietario no puede salir del hogar. Transfiere primero el rol.");
        }

        // Eliminar
        memberRepository.delete(member);
    }

    private void verifyUserIsOwnerOrAdmin(Long householdId, Long userId) {
        HouseholdMember member = memberRepository.findByHouseholdIdAndUserId(householdId, userId).orElseThrow(() -> new RuntimeException("No eres miembro de este hogar"));

        if (member.getRole() == HouseholdMember.Role.MEMBER) {
            throw new RuntimeException("No tienes permisos para realizar esta acción");
        }
    }

    private void verifyUserIsOwner(Long householdId, Long userId) {
        HouseholdMember member = memberRepository.findByHouseholdIdAndUserId(householdId, userId).orElseThrow(() -> new RuntimeException("No eres miembro de este hogar"));

        if (member.getRole() != HouseholdMember.Role.OWNER) {
            throw new RuntimeException("Solo el propietario puede realizar esta acción");
        }
    }
}
