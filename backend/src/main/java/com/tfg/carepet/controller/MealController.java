package com.tfg.carepet.controller;

import com.tfg.carepet.dto.MealLogRequest;
import com.tfg.carepet.dto.MealLogResponse;
import com.tfg.carepet.dto.MealRequest;
import com.tfg.carepet.dto.MealResponse;
import com.tfg.carepet.service.MealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealController {

    private final MealService mealService;

    // Crear comida
    @PostMapping
    public ResponseEntity<?> createMeal(@Valid @RequestBody MealRequest request) {
        try {
            MealResponse meal = mealService.createMeal(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(meal);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Listar comidas de una mascota
    @GetMapping
    public ResponseEntity<List<MealResponse>> getMealsByPet(@RequestParam Long petId) {
        List<MealResponse> meals = mealService.getMealsByPet(petId);

        return ResponseEntity.ok(meals);
    }

    // Obtener comida por id
    @GetMapping("/{id}")
    public ResponseEntity<?> getMealById(@PathVariable Long id) {
        try {
            MealResponse meal = mealService.getMealById(id);
            return ResponseEntity.ok(meal);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Actualizar comida
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeal(@PathVariable Long id, @Valid @RequestBody MealRequest request) {
        try {
            MealResponse meal = mealService.updateMeal(id, request);
            return ResponseEntity.ok(meal);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar comida
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeal(@PathVariable Long id) {
        try {
            mealService.deleteMeal(id);
            return ResponseEntity.ok("Comida eliminada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Registrar que se dio una comida
    @PostMapping("/{id}/log")
    public ResponseEntity<?> logMeal(@PathVariable Long id, @Valid @RequestBody MealLogRequest request) {
        try {
            request.setMealId(id);

            MealLogResponse log = mealService.logMeal(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(log);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ver historial de comidas
    @GetMapping("/{id}/history")
    public ResponseEntity<List<MealLogResponse>> getMealHistory(@PathVariable Long id) {
        List<MealLogResponse> history = mealService.getMealHistory(id);
        return ResponseEntity.ok(history);
    }
}
