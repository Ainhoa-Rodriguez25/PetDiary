package com.tfg.carepet.service;

import ch.qos.logback.core.joran.conditional.IfAction;
import com.tfg.carepet.dto.MealLogRequest;
import com.tfg.carepet.dto.MealLogResponse;
import com.tfg.carepet.dto.MealRequest;
import com.tfg.carepet.dto.MealResponse;
import com.tfg.carepet.model.Meal;
import com.tfg.carepet.model.MealLog;
import com.tfg.carepet.repository.MealLogRepository;
import com.tfg.carepet.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MealService {

    private final MealRepository mealRepository;
    private final MealLogRepository mealLogRepository;

    // Crear comida
    public MealResponse createMeal(MealRequest request) {
        Meal meal = new Meal();
        meal.setPetId(request.getPetId());
        meal.setMealsPerDay(Integer.parseInt(request.getMealsPerDay()));
        meal.setFirstTime(LocalTime.parse(request.getFirstTime()));

        // Convertir horarios opcionales
        if (request.getSecondTime() != null && !request.getSecondTime().isEmpty()) {
            meal.setSecondTime(LocalTime.parse(request.getSecondTime()));
        }

        if (request.getThirdTime() != null && !request.getThirdTime().isEmpty()) {
            meal.setThirdTime(LocalTime.parse(request.getThirdTime()));
        }

        if (request.getFourthTime() != null && !request.getFourthTime().isEmpty()) {
            meal.setFourthTime(LocalTime.parse(request.getFourthTime()));
        }

        meal.setNotes(request.getNotes());

        Meal savedMeal = mealRepository.save(meal);

        return convertToMealResponse(savedMeal);
    }

    // Listar comidas activas de una mascota
    public List<MealResponse> getMealsByPet(Long petId) {
        return mealRepository.findByPetIdAndActiveTrue(petId)
                .stream()
                .map(this::convertToMealResponse)
                .collect(Collectors.toList());
    }

    // Obtener una comida por ID
    public MealResponse getMealById(Long id) {
        Meal meal = mealRepository.findById(id).orElseThrow(() -> new RuntimeException("Comida no encontrada"));

        return convertToMealResponse(meal);
    }

    // Actualizar comida
    public MealResponse updateMeal(Long id, MealRequest request) {
        Meal meal = mealRepository.findById(id).orElseThrow(() -> new RuntimeException("Comida no encontrada"));

        meal.setMealsPerDay(Integer.parseInt(request.getMealsPerDay()));
        meal.setFirstTime(LocalTime.parse(request.getFirstTime()));

        // Actualizar horarios opcionales
        if (request.getSecondTime() != null && !request.getSecondTime().isEmpty()) {
            meal.setSecondTime(LocalTime.parse(request.getSecondTime()));
        } else {
            meal.setSecondTime(null);
        }

        if (request.getThirdTime() != null && !request.getThirdTime().isEmpty()) {
            meal.setThirdTime(LocalTime.parse(request.getThirdTime()));
        } else {
            meal.setThirdTime(null);
        }

        if (request.getFourthTime() != null && !request.getFourthTime().isEmpty()) {
            meal.setFourthTime(LocalTime.parse(request.getFourthTime()));
        } else {
            meal.setFourthTime(null);
        }

        meal.setNotes(request.getNotes());

        Meal updatedMeal = mealRepository.save(meal);

        return convertToMealResponse(updatedMeal);
    }

    // Eliminar comida
    public void deleteMeal(Long id) {
        if (!mealRepository.existsById(id)) {
            throw new RuntimeException("Comida no encontrada");
        }

        mealRepository.deleteById(id);
    }

    // Registrar que se dio una comida
    public MealLogResponse logMeal(MealLogRequest request) {
        // Buscar comida
        Meal meal = mealRepository.findById(request.getMealId()).orElseThrow(() -> new RuntimeException("Comida no encontrada"));

        // Validar cuantas veces se dió de comer en el mismo dia
        LocalDate today = LocalDate.now();

        Long count = mealLogRepository.countByMealIdAndDate(request.getMealId(), today);

        if (count >= meal.getMealsPerDay()) {
            throw new RuntimeException("La comida ya se administró " + count + " vez/veces hoy. " + "Según la configuración (mealsPerDay = " + meal.getMealsPerDay() + "), " + "solo se puede administrar " + meal.getMealsPerDay() + " vez/veces al día.");
        }

        // Crear log
        MealLog log = new MealLog();
        log.setMealId(request.getMealId());

        // Determinar cuando se administró
        if (request.getGivenAt() != null && !request.getGivenAt().isEmpty()) {
            log.setGivenAt(LocalDateTime.parse(request.getGivenAt()));
        } else {
            log.setGivenAt(LocalDateTime.now());
        }

        log.setGivenByUserId(null);
        log.setNotes(request.getNotes());

        // Guardar
        MealLog savedLog = mealLogRepository.save(log);

        return convertToLogResponse(savedLog);
    }

    // Obtener historial de una comida
    public List<MealLogResponse> getMealHistory(Long mealId) {
        return mealLogRepository.findByMealIdOrderByGivenAtDesc(mealId)
                .stream()
                .map(this::convertToLogResponse)
                .collect(Collectors.toList());
    }

    // Convertir Meal Entity a DTO
    private MealResponse convertToMealResponse(Meal meal) {
        MealResponse response = new MealResponse();

        response.setId(meal.getId());
        response.setPetId(meal.getPetId());
        response.setMealsPerDay(meal.getMealsPerDay().toString());
        response.setFirstTime(meal.getFirstTime().toString());

        // Convertir horarios opcionales
        if (meal.getSecondTime() != null) {
            response.setSecondTime(meal.getSecondTime().toString());
        }

        if (meal.getThirdTime() != null) {
            response.setThirdTime(meal.getThirdTime().toString());
        }

        if (meal.getFourthTime() != null) {
            response.setFourthTime(meal.getFourthTime().toString());
        }

        response.setNotes(meal.getNotes());
        response.setActive(meal.getActive());
        response.setCreatedAt(meal.getCreatedAt());
        response.setUpdatedAt(meal.getUpdatedAt());

        return response;
    }

    // Convertir MealLog Entity a DTO
    private MealLogResponse convertToLogResponse(MealLog log) {
        MealLogResponse response = new MealLogResponse();

        response.setId(log.getId());
        response.setMealId(log.getMealId());
        response.setGivenByUserId(log.getGivenByUserId());
        response.setGivenByUserName(null);
        response.setGivenAt(log.getGivenAt());
        response.setNotes(log.getNotes());
        response.setCreatedAt(log.getCreatedAt());

        return response;
    }
}
