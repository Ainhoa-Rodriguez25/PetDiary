package com.tfg.carepet.service;

import com.tfg.carepet.dto.HouseholdRequest;
import com.tfg.carepet.dto.HouseholdResponse;
import com.tfg.carepet.dto.MemberResponse;
import com.tfg.carepet.model.Household;
import com.tfg.carepet.model.HouseholdMember;
import com.tfg.carepet.repository.HouseholdMemberRepository;
import com.tfg.carepet.repository.HouseholdRepository;
import com.tfg.carepet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final UserRepository userRepository;

    // Crear hogar
    @Transactional
    public HouseholdResponse createHousehold(Long userId, HouseholdRequest request) {
        // Objeto hogar
        Household household = new Household();
        household.setName(request.getName());
        household.setDescription(request.getDescription());
        household.setCreatedByUserId(userId);

        Household savedHousehold = householdRepository.save(household);

        // Objeto miembro
        HouseholdMember owner = new HouseholdMember();
        owner.setHouseholdId(savedHousehold.getId());
        owner.setUserId(userId);
        owner.setRole(HouseholdMember.Role.OWNER);

        householdMemberRepository.save(owner);

        return convertToHouseholdResponse(savedHousehold);
    }

    // Buscar hogares donde el usuario es miembro
    public List<HouseholdResponse> getHouseholdsByUser(Long userId) {
        return householdRepository.findHouseholdsByUserId(userId)
                .stream()
                .map(this::convertToHouseholdResponse)
                .collect(Collectors.toList());
    }

    // Buscar hogar por ID
    public HouseholdResponse getHouseholdById(Long id) {
        Household household = householdRepository.findById(id).orElseThrow(() -> new RuntimeException("Hogar no encontrado"));

        return convertToHouseholdResponse(household);
    }

    // Actualizar datos del hogar
    @Transactional
    public HouseholdResponse updateHousehold(Long id, Long userId, HouseholdRequest request) {
        // Verificar que userId es OWNER
        verifyUserIsOwner(id, userId);

        // Buscar hogar
        Household household = householdRepository.findById(id).orElseThrow(() -> new RuntimeException("Hogar no encontrado"));

        // Actualizar campos
        household.setName(request.getName());
        household.setDescription(request.getDescription());

        Household updatedHousehold = householdRepository.save(household);

        return convertToHouseholdResponse(updatedHousehold);
    }

    // Eliminar hogar
    @Transactional
    public void deleteHousehold(Long id, Long userId) {
        verifyUserIsOwner(id, userId);

        if (!householdRepository.existsById(id)) {
            throw new RuntimeException("Hogar no encontrado");
        }

        householdRepository.deleteById(id);
    }

    // Obtener lista de miembros del hogar con sus datos
    public List<MemberResponse> getHouseholdMembers(Long householdId) {
        // Buscar miembros
        List<HouseholdMember> members = householdMemberRepository.findByHouseholdId(householdId);

        // Convertir cada miembro a MemberResponse
        return members.stream()
                .map(member -> {
                    MemberResponse response = new MemberResponse();
                    response.setId(member.getId());
                    response.setUserId(member.getUserId());
                    response.setRole(member.getRole().name());
                    response.setJoinedAt(member.getJoinedAt());

                    // Buscar informacion usuario
                    userRepository.findById(member.getUserId())
                            .ifPresent(user -> {
                                response.setUserName(user.getName());
                                response.setUserEmail(user.getEmail());
                            });
                    return response;
                })
                .collect(Collectors.toList());
    }

    private HouseholdResponse convertToHouseholdResponse(Household household) {
        HouseholdResponse response = new HouseholdResponse();

        response.setId(household.getId());
        response.setName(household.getName());
        response.setCreatedByUserId(household.getCreatedByUserId());
        response.setDescription(household.getDescription());
        response.setCreatedAt(household.getCreatedAt());
        response.setUpdatedAt(household.getUpdatedAt());

        return response;
    }

    private void verifyUserIsOwner(Long householdId, Long userId) {
        HouseholdMember member = householdMemberRepository.findByHouseholdIdAndUserId(householdId, userId).orElseThrow(() -> new RuntimeException("No eres miembro de este hogar"));

        if (member.getRole() != HouseholdMember.Role.OWNER) {
            throw new RuntimeException("Solo el propietario puede realizar esta acción");
        }
    }
}
