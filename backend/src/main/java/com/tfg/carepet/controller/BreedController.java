package com.tfg.carepet.controller;

import com.tfg.carepet.dto.BreedResponse;
import com.tfg.carepet.service.BreedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/breeds")
@RequiredArgsConstructor
public class BreedController {

    private final BreedService breedService;

    @GetMapping
    public ResponseEntity<List<BreedResponse>> getAllBreeds(
            @RequestParam(required = false) String species
    ) {
        if (species != null) {
            return ResponseEntity.ok(breedService.getBreedsBySpecies(species));
        }

        return ResponseEntity.ok(breedService.getAllBreeds());
    }
}
