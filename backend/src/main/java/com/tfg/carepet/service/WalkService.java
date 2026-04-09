package com.tfg.carepet.service;

import com.tfg.carepet.dto.WalkRequest;
import com.tfg.carepet.dto.WalkResponse;
import com.tfg.carepet.model.Walk;
import com.tfg.carepet.repository.WalkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalkService {

    private final WalkRepository walkRepository;

    // Registrar paseo
    public WalkResponse createWalk(WalkRequest request) {
        Walk walk = new Walk();
        walk.setPetId(request.getPetId());

        // Determinar cuándo fue el paseo
        if (request.getWalkedAt() != null && !request.getWalkedAt().isEmpty()) {
            walk.setWalkedAt(LocalDateTime.parse(request.getWalkedAt()));
        } else {
            walk.setWalkedAt(LocalDateTime.now());
        }

        // Convertir duración
        if (request.getDuration() != null && !request.getDuration().isEmpty()) {
            walk.setDuration(Integer.parseInt(request.getDuration()));
        }

        walk.setWalkedByUserId(null);
        walk.setNotes(request.getNotes());

        Walk savedWalk = walkRepository.save(walk);

        return convertToWalkResponse(savedWalk);
    }

    // Listar paseos de una mascota
    public List<WalkResponse> getWalksByPet(Long petId) {
        return walkRepository.findByPetIdOrderByWalkedAtDesc(petId)
                .stream()
                .map(this::convertToWalkResponse)
                .collect(Collectors.toList());
    }

    // Obtener un paseo por ID
    public WalkResponse getWalkById(Long id) {
        Walk walk = walkRepository.findById(id).orElseThrow(() -> new RuntimeException("Paseo no encontrado"));

        return convertToWalkResponse(walk);
    }

    // Eliminar paseo
    public void deleteWalk(Long id) {
        if (!walkRepository.existsById(id)) {
            throw  new RuntimeException("Paseo no encontrado");
        }

        walkRepository.deleteById(id);
    }

    // Obtener historial de paseos en rango de fechas
    public List<WalkResponse> getWalkHistory(Long petId, LocalDateTime startDate, LocalDateTime endDate) {
        return walkRepository.findByPetIdAndDateRange(petId, startDate, endDate)
                .stream()
                .map(this::convertToWalkResponse)
                .collect(Collectors.toList());
    }

    // Convertir Walk Entity a DTO
    private WalkResponse convertToWalkResponse(Walk walk) {
        WalkResponse response = new WalkResponse();

        response.setId(walk.getId());
        response.setPetId(walk.getPetId());
        response.setWalkedByUserId(walk.getWalkedByUserId());
        response.setWalkedByUserName(null);
        response.setWalkedAt(walk.getWalkedAt());
        response.setDuration(walk.getDuration());
        response.setNotes(walk.getNotes());
        response.setCreatedAt(walk.getCreatedAt());

        return response;
    }
}
