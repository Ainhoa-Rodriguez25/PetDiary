package com.tfg.carepet.repository;

import com.tfg.carepet.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {

    // Buscar comidas por mascota
    List<Meal> findByPetId(Long petId);

    // Buscar comidas activas de una mascota
    List<Meal> findByPetIdAndActiveTrue(Long petId);

    // Buscar comidas por mascota y estado
    List<Meal> findByPetIdAndActive(Long petId, Boolean active);
}
