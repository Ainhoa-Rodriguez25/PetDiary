package com.tfg.carepet.repository;

import com.tfg.carepet.model.Medication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationRepository extends JpaRepository<Medication, Long> {

    // Buscar medicamentos por mascota
    List<Medication> findByPetId(Long petId);

    // Buscar medicamentos activos de una mascota
    List<Medication> findByPetIdAndActiveTrue(Long petId);

    // Buscar medicamentos por mascota y estado
    List<Medication> findByPetIdAndActive(Long petId, Boolean active);
}
