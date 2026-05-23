package com.tfg.carepet.service;

import com.tfg.carepet.dto.WalkRequest;
import com.tfg.carepet.dto.WalkResponse;
import com.tfg.carepet.model.User;
import com.tfg.carepet.model.Walk;
import com.tfg.carepet.repository.UserRepository;
import com.tfg.carepet.repository.WalkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalkService {

    private final WalkRepository walkRepository;
    private final UserRepository userRepository;

    public WalkResponse createWalk(WalkRequest request) {
        Walk walk = new Walk();
        walk.setPetId(request.getPetId());

        if (request.getWalkedAt() != null && !request.getWalkedAt().isEmpty()) {
            walk.setWalkedAt(LocalDateTime.parse(request.getWalkedAt()));
        } else {
            walk.setWalkedAt(LocalDateTime.now());
        }

        if (request.getDuration() != null && !request.getDuration().isEmpty()) {
            walk.setDuration(Integer.parseInt(request.getDuration()));
        }

        // Obtener usuario autenticado del JWT
        UserDetails userDetails = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Long userId = Long.parseLong(userDetails.getUsername());
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        walk.setWalkedByUserId(currentUser.getId());
        walk.setNotes(request.getNotes());

        // Nuevos campos
        walk.setHadPee(request.getHadPee());
        walk.setHadPoop(request.getHadPoop());

        Walk savedWalk = walkRepository.save(walk);

        return convertToWalkResponse(savedWalk, currentUser);
    }

    public List<WalkResponse> getWalksByPet(Long petId) {
        return walkRepository.findByPetIdOrderByWalkedAtDesc(petId)
                .stream()
                .map(this::convertToWalkResponse)
                .collect(Collectors.toList());
    }

    public WalkResponse getWalkById(Long id) {
        Walk walk = walkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paseo no encontrado"));
        return convertToWalkResponse(walk);
    }

    public void deleteWalk(Long id) {
        if (!walkRepository.existsById(id)) {
            throw new RuntimeException("Paseo no encontrado");
        }
        walkRepository.deleteById(id);
    }

    public List<WalkResponse> getWalkHistory(Long petId, LocalDateTime startDate, LocalDateTime endDate) {
        return walkRepository.findByPetIdAndDateRange(petId, startDate, endDate)
                .stream()
                .map(this::convertToWalkResponse)
                .collect(Collectors.toList());
    }

    // Versión con usuario — para createWalk
    private WalkResponse convertToWalkResponse(Walk walk, User user) {
        WalkResponse response = new WalkResponse();
        response.setId(walk.getId());
        response.setPetId(walk.getPetId());
        response.setWalkedByUserId(walk.getWalkedByUserId());
        response.setWalkedByUserName(user != null ? user.getName() : null);
        response.setWalkedAt(walk.getWalkedAt());
        response.setDuration(walk.getDuration());
        response.setNotes(walk.getNotes());
        response.setHadPee(walk.getHadPee());
        response.setHadPoop(walk.getHadPoop());
        response.setCreatedAt(walk.getCreatedAt());
        return response;
    }

    // Versión para listado — busca el usuario por id
    private WalkResponse convertToWalkResponse(Walk walk) {
        User user = null;
        if (walk.getWalkedByUserId() != null) {
            user = userRepository.findById(walk.getWalkedByUserId()).orElse(null);
        }
        return convertToWalkResponse(walk, user);
    }
}