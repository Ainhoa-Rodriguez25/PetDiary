package com.tfg.carepet.service;

import com.tfg.carepet.dto.MedicationLogRequest;
import com.tfg.carepet.dto.MedicationLogResponse;
import com.tfg.carepet.dto.MedicationRequest;
import com.tfg.carepet.dto.MedicationResponse;
import com.tfg.carepet.model.Medication;
import com.tfg.carepet.model.MedicationLog;
import com.tfg.carepet.repository.MedicationLogRepository;
import com.tfg.carepet.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final MedicationLogRepository medicationLogRepository;

    // Crear medicamento
    public MedicationResponse createMedication(MedicationRequest request) {
        Medication medication = new Medication();
        medication.setPetId(request.getPetId());
        medication.setName(request.getName());
        medication.setDosage(request.getDosage());
        medication.setFrequency(Medication.Frequency.valueOf(request.getFrequency()));
        medication.setTimeOfDay(LocalTime.parse(request.getTimeOfDay()));

        // Convertir second time (si no es null)
        if (request.getSecondTime() != null && !request.getSecondTime().isEmpty()) {
            medication.setSecondTime(LocalTime.parse(request.getSecondTime()));
        }

        // Convertir third time (si no es null)
        if (request.getThirdTime() != null && !request.getThirdTime().isEmpty()) {
            medication.setThirdTime(LocalTime.parse(request.getThirdTime()));
        }

        // Convertir startDate en LocalDate
        medication.setStartDate(LocalDate.parse(request.getStartDate()));

        // Convertir endDate en LocalDate
        if (request.getEndDate() != null && !request.getEndDate().isEmpty()) {
            medication.setEndDate(LocalDate.parse(request.getEndDate()));
        }

        medication.setNotes(request.getNotes());

        Medication savedMedication = medicationRepository.save(medication);

        return convertToMedicationResponse(savedMedication);
    }

    public List<MedicationResponse> getMedicationsByPet(Long petId) {
        return medicationRepository.findByPetIdAndActiveTrue(petId)
                .stream()
                .map(this::convertToMedicationResponse)
                .collect(Collectors.toList());
    }

    public MedicationResponse getMedicationById(Long medicationId) {
        Medication medication = medicationRepository.findById(medicationId).orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

        return convertToMedicationResponse(medication);
    }

    public MedicationResponse updateMedication(Long medicationId, MedicationRequest request) {
        Medication medication = medicationRepository.findById(medicationId).orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

        // Actualizar campos
        medication.setName(request.getName());
        medication.setDosage(request.getDosage());
        medication.setFrequency(Medication.Frequency.valueOf(request.getFrequency()));
        medication.setTimeOfDay(LocalTime.parse(request.getTimeOfDay()));

        // Convertir second time (si no es null)
        if (request.getSecondTime() != null && !request.getSecondTime().isEmpty()) {
            medication.setSecondTime(LocalTime.parse(request.getSecondTime()));
        } else {
            medication.setSecondTime(null);
        }

        // Convertir third time (si no es null)
        if (request.getThirdTime() != null && !request.getThirdTime().isEmpty()) {
            medication.setThirdTime(LocalTime.parse(request.getThirdTime()));
        }  else {
            medication.setThirdTime(null);
        }

        // Convertir startDate en LocalDate
        medication.setStartDate(LocalDate.parse(request.getStartDate()));

        // Convertir endDate en LocalDate
        if (request.getEndDate() != null && !request.getEndDate().isEmpty()) {
            medication.setEndDate(LocalDate.parse(request.getEndDate()));
        }  else {
            medication.setEndDate(null);
        }

        medication.setNotes(request.getNotes());

        Medication updatedMedication = medicationRepository.save(medication);

        return convertToMedicationResponse(updatedMedication);
    }

    public void deleteMedication(Long medicationId) {
        if (!medicationRepository.existsById(medicationId)) {
            throw new RuntimeException("Medicamento no encontrado");
        }

        medicationRepository.deleteById(medicationId);
    }

    public MedicationLogResponse logMedication(MedicationLogRequest request) {
        Medication medication = medicationRepository.findById(request.getMedicationId()).orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

        // Validación anti-duplicados
        LocalDate today = LocalDate.now();

        Long count = medicationLogRepository.countByMedicationIdAndDate(request.getMedicationId(), today);

        int maxTimesPerDay;

        switch (medication.getFrequency()) {
            case daily:
                maxTimesPerDay = 1;
                break;
            case every_12h:
                maxTimesPerDay = 2;
                break;
            case every_8h:
                maxTimesPerDay = 3;
                break;
            case weekly:
                maxTimesPerDay = 1;
                break;
            case as_needed:
                maxTimesPerDay = Integer.MAX_VALUE;
                break;
            default:
                maxTimesPerDay = 1;
        }

        if (count >= maxTimesPerDay) {
            throw new RuntimeException(
                    "El medicamento ya se administró " + count + " vez/veces hoy. " + "Según la frecuencia (" + medication.getFrequency() + "), " + "solo se puede administrar " + maxTimesPerDay + " vez/veces al día."
            );
        }

        // Crear log
        MedicationLog log = new MedicationLog();
        log.setMedicationId(request.getMedicationId());

        if (request.getGivenAt() != null && !request.getGivenAt().isEmpty()) {
            log.setGivenAt(LocalDateTime.parse(request.getGivenAt()));
        } else {
            log.setGivenAt(LocalDateTime.now());
        }

        log.setGivenByUserId(null); // Se debe cambiar!!!
        log.setNotes(request.getNotes());

        // Guardar en la BD
        MedicationLog savedLog = medicationLogRepository.save(log);

        return convertToLogResponse(savedLog);
    }

    public List<MedicationLogResponse> getMedicationHistory(Long medicationId) {
        return medicationLogRepository.findByMedicationIdOrderByGivenAtDesc(medicationId)
                .stream()
                .map(this::convertToLogResponse)
                .collect(Collectors.toList());
    }

    private MedicationResponse convertToMedicationResponse(Medication medication) {
        MedicationResponse response = new MedicationResponse();

        response.setId(medication.getId());
        response.setPetId(medication.getPetId());
        response.setName(medication.getName());
        response.setDosage(medication.getDosage());
        response.setNotes(medication.getNotes());
        response.setActive(medication.getActive());
        response.setCreatedAt(medication.getCreatedAt());
        response.setUpdatedAt((medication.getUpdatedAt()));
        response.setFrequency(medication.getFrequency().name());
        response.setTimeOfDay(medication.getTimeOfDay().toString());

        if (medication.getSecondTime() != null) {
            response.setSecondTime(medication.getSecondTime().toString());
        }

        if (medication.getThirdTime() != null) {
            response.setThirdTime(medication.getThirdTime().toString());
        }

        response.setStartDate(medication.getStartDate().toString());

        if (medication.getEndDate() != null) {
            response.setEndDate(medication.getEndDate().toString());
        }

        return response;
    }

    private MedicationLogResponse convertToLogResponse(MedicationLog log) {
        MedicationLogResponse response = new MedicationLogResponse();

        response.setId(log.getId());
        response.setMedicationId(log.getMedicationId());
        response.setGivenByUserId(log.getGivenByUserId());
        response.setGivenByUserName(null);
        response.setGivenAt(log.getGivenAt());
        response.setNotes(log.getNotes());
        response.setCreatedAt(log.getCreatedAt());

        return response;
    }
}
