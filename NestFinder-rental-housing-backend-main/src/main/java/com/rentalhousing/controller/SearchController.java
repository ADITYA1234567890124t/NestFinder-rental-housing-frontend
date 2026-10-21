package com.rentalhousing.controller;

import com.rentalhousing.dto.response.PropertyResponseDTO;
import com.rentalhousing.service.SearchService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Property search and filtering (public)")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/properties")
    @Operation(summary = "Filter properties by city, BHK, rent range, type, furnishing")
    public ResponseEntity<ApiResponse<Page<PropertyResponseDTO>>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Integer bhk,
            @RequestParam(required = false) BigDecimal minRent,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String furnishingStatus,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "monthlyRent") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return ResponseEntity.ok(ApiResponse.success(
                searchService.searchProperties(city,state, bhk, minRent, maxRent,
                        propertyType, furnishingStatus, PageRequest.of(page, size, sort))));
    }

    @GetMapping("/full-text")
    @Operation(summary = "Full-text search across property title, city, and address")
    public ResponseEntity<ApiResponse<Page<PropertyResponseDTO>>> fullTextSearch(
            @RequestParam String query,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                searchService.fullTextSearch(query, PageRequest.of(page, size))));
    }
}
