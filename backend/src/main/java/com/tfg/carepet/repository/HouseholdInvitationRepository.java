package com.tfg.carepet.repository;

import com.tfg.carepet.model.HouseholdInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdInvitationRepository extends JpaRepository<HouseholdInvitation, Long> {

    // Buscar invitaciones pendientes de un usuario (por email)
    List<HouseholdInvitation> findByInvitedUserEmailAndStatus(String invitedUserEmail, HouseholdInvitation.Status status);

    // Buscar invitaciones enviadas por un usuario
    List<HouseholdInvitation> findByHouseholdId(Long householdId);

    // Buscar invitaciones de un hogar
    List<HouseholdInvitation> findByInvitedByUserId(Long invitedByUserId);

    // Verificar si ya existe invitación pendiente
    boolean existsByHouseholdIdAndInvitedUserEmailAndStatus(Long householdId, String invitedUserEmail, HouseholdInvitation.Status status);

    // Buscar invitación específica pendiente
    Optional<HouseholdInvitation> findByIdAndStatus(Long id, HouseholdInvitation.Status status);
}
