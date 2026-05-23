package com.tfg.carepet.service;

import com.tfg.carepet.dto.BreedResponse;
import com.tfg.carepet.dto.PetRequest;
import com.tfg.carepet.dto.PetResponse;
import com.tfg.carepet.model.Breed;
import com.tfg.carepet.model.Pet;
import com.tfg.carepet.repository.BreedRepository;
import com.tfg.carepet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final BreedRepository breedRepository;

    // Crear una mascota
    public PetResponse createPet(PetRequest request) {
        Pet pet = new Pet();
        pet.setHouseholdId(request.getHouseholdId());
        pet.setName(request.getName());
        pet.setSpecies(Pet.Species.valueOf(request.getSpecies()));

        // Asignar raza (si se proporciona breedId)
        if (request.getBreedId() != null) {
            Breed breed = breedRepository.findById(request.getBreedId()).orElseThrow(() -> new RuntimeException("Raza no encontrada"));
            pet.setBreed(breed);
        }

        pet.setCustomBreed(request.getCustomBreed());
        pet.setBirthDate(request.getBirthDate());
        pet.setWeight(request.getWeight());

        if (request.getGender() != null) {
            pet.setGender(Pet.Gender.valueOf(request.getGender()));
        }

        pet.setAllergies(request.getAllergies());
        pet.setMedicalNotes(request.getMedicalNotes());

        Pet savedPet = petRepository.save(pet);

        return convertToResponse(savedPet);
    }

    // Listar mascotas por hogar
    public List<PetResponse> getPetsByHousehold(Long householdId) {
        return petRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Obtener una mascota por ID
    public  PetResponse getPetById(Long id) {
        Pet pet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        return convertToResponse(pet);
    }

    // Actualizar mascota
    public PetResponse updatePet(Long id, PetRequest request) {
        Pet pet = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        pet.setName(request.getName());
        pet.setSpecies(Pet.Species.valueOf(request.getSpecies()));

        // Actualizar raza
        if (request.getBreedId() != null) {
            Breed breed = breedRepository.findById(request.getBreedId()).orElseThrow(() -> new RuntimeException("Raza no encontrada"));
            pet.setBreed(breed);
        } else {
            pet.setBreed(null);
        }

        pet.setCustomBreed(request.getCustomBreed());
        pet.setBirthDate(request.getBirthDate());
        pet.setWeight(request.getWeight());

        if (request.getGender() != null) {
            pet.setGender(Pet.Gender.valueOf(request.getGender()));
        }

        pet.setAllergies(request.getAllergies());
        pet.setMedicalNotes(request.getMedicalNotes());

        Pet updatedPet = petRepository.save(pet);

        return convertToResponse(updatedPet);
    }

    // Eliminar mascota
    public void deletePet(Long id) {
        if (!petRepository.existsById(id)) {
            throw new RuntimeException("Mascota no encontrada");
        }
        petRepository.deleteById(id);
    }

    // Convertir Entity en DTO
    private PetResponse convertToResponse(Pet pet) {
        PetResponse response = new PetResponse();
        response.setId(pet.getId());
        response.setHouseholdId(pet.getHouseholdId());
        response.setName(pet.getName());
        response.setSpecies(pet.getSpecies().name());

        // Convertir Breed a BreedResponse
        if (pet.getBreed() != null) {
            BreedResponse breedResponse = new BreedResponse(
                    pet.getBreed().getId(),
                    pet.getBreed().getName(),
                    pet.getBreed().getSpecies().name()
            );
            response.setBreed(breedResponse);
        }

        response.setCustomBreed(pet.getCustomBreed());
        response.setBirthDate(pet.getBirthDate());
        response.setWeight(pet.getWeight());
        response.setGender(pet.getGender() != null ? pet.getGender().name() : null);
        response.setAllergies(pet.getAllergies());
        response.setMedicalNotes(pet.getMedicalNotes());
        response.setCreatedAt(pet.getCreatedAt());
        response.setUpdatedAt(pet.getUpdatedAt());

        return response;
    }
}
