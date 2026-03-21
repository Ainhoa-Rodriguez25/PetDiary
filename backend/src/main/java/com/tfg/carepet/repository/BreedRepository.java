package com.tfg.carepet.repository;

import com.tfg.carepet.model.Breed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BreedRepository extends JpaRepository<Breed, Long> {

    // Buscar razas por especie
    List<Breed> findBySpecies(Breed.Species species);

    // Buscar razas por especie, ordenadas alfabeticamente
    List<Breed> findBySpeciesOrderByNameAsc(Breed.Species species);
}
