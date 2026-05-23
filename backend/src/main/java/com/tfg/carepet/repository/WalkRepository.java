package com.tfg.carepet.repository;

import com.tfg.carepet.model.Walk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WalkRepository extends JpaRepository<Walk, Long> {

    // Buscar paseos por mascota
    List<Walk> findByPetIdOrderByWalkedAtDesc(Long petId);

    // Buscar paseos de una mascota en rango de fechas
    @Query("SELECT w FROM Walk w WHERE w.petId = :petId AND w.walkedAt BETWEEN :startDate AND :endDate ORDER BY w.walkedAt DESC")
    List<Walk> findByPetIdAndDateRange(@Param("petId") Long petId, @Param("startDate")LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Contar paseos de una mascota
    Long countByPetId(Long petId);
}
