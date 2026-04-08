package com.tfg.carepet.repository;

import com.tfg.carepet.model.MealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MealLogRepository extends JpaRepository<MealLog, Long> {

    // Buscar logs por comida
    List<MealLog> findByMealIdOrderByGivenAtDesc(Long mealId);

    // Contar cuántas veces se dio una comida HOY
    @Query("SELECT COUNT(ml) FROM MealLog ml WHERE ml.mealId = :mealId AND DATE(ml.givenAt) = :date")
    Long countByMealIdAndDate(@Param("mealId") Long mealId, @Param("date")LocalDate date);

    // Buscar logs de una comida en un rango de fechas
    @Query("SELECT ml FROM MealLog ml WHERE ml.mealId = :mealId AND ml.givenAt BETWEEN :startDate AND :endDate ORDER BY ml.givenAt DESC")
    List<MealLog> findByMealIdAndDateRange(@Param("mealId") Long mealId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
