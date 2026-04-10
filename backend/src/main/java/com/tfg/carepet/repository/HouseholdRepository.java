package com.tfg.carepet.repository;

import com.tfg.carepet.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, Long> {

    // Buscar hogares donde el usuario es miembro
    @Query("SELECT h FROM Household h JOIN HouseholdMember hm ON h.id = hm.householdId WHERE hm.userId = :userId")
    List<Household> findHouseholdsByCreatedByUserId(@Param("userId") Long userId);

    // Buscar hogares creados por un usuario
    List<Household> findByCreatedByUserId(Long createdBy);

    // Verificar si un hogar existe
    boolean existsById(Long id);
}
