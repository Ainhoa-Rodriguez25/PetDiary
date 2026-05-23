package com.tfg.carepet.repository;

import com.tfg.carepet.model.MedicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicationLogRepository extends JpaRepository<MedicationLog, Long> {

    // Buscar logs por medicamento
    List<MedicationLog> findByMedicationIdOrderByGivenAtDesc(Long medicationId);

    // Contar cuantas veces se ha dado un medicamento HOY
    @Query("SELECT COUNT(ml) FROM MedicationLog ml WHERE ml.medicationId = :medicationId AND DATE(ml.givenAt) = :date")
    Long countByMedicationIdAndDate(@Param("medicationId") Long medicationId, @Param("date")LocalDate date);

    // Buscar logs de un medicamento en un rango de fechas
    @Query("SELECT ml FROM MedicationLog ml WHERE ml.medicationId = :medicationId AND ml.givenAt BETWEEN :startDate AND :endDate ORDER BY ml.givenAt DESC")
    List<MedicationLog> findByMedicationIdAndDateRange(@Param("medicationId") Long medicationId, @Param("startDate")LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
