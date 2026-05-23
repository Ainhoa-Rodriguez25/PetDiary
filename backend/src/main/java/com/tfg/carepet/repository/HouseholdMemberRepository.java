package com.tfg.carepet.repository;

import com.tfg.carepet.model.HouseholdMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdMemberRepository extends JpaRepository<HouseholdMember, Long> {

    // Buscar miembros de un hogar
    List<HouseholdMember> findByHouseholdId(Long householdId);

    // Buscar hogares de un usuario
    List<HouseholdMember> findByUserId(Long userId);

    // Buscar miembro especifico en hogar
    Optional<HouseholdMember> findByHouseholdIdAndUserId(Long householdId, Long userId);

    // Verificar si un usuario ya es miembro de un hogar
    boolean existsByHouseholdIdAndUserId(Long householdId, Long userId);

    // Contar miembros de un hogar
    Long countByHouseholdId(Long householdId);

    // Eliminar miembro de un hogar
    void deleteByHouseholdIdAndUserId(Long householdId, Long userId);
}
