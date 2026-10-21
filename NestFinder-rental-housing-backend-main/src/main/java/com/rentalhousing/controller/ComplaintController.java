package com.rentalhousing.controller;

import com.rentalhousing.dto.request.ComplaintRequestDTO;
import com.rentalhousing.dto.response.ComplaintResponseDTO;
import com.rentalhousing.enums.ComplaintStatus;
import com.rentalhousing.service.ComplaintService;
import com.rentalhousing.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@Tag(
        name = "Complaints",
        description = "Complaint submission and management"
)
public class ComplaintController {

    private final ComplaintService complaintService;

    /* ------------------------------------------------------- */
    /* Submit Complaint                                         */
    /* ------------------------------------------------------- */

    @PostMapping
    @Operation(summary = "Submit a new complaint")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> createComplaint(
            @Valid @RequestBody ComplaintRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Complaint submitted",
                                complaintService.createComplaint(
                                        request,
                                        userDetails.getUsername()
                                )
                        )
                );
    }

    /* ------------------------------------------------------- */
    /* Current User Complaints                                  */
    /* ------------------------------------------------------- */

    @GetMapping("/my-complaints")
    @Operation(summary = "Get all complaints filed by current user")
    public ResponseEntity<ApiResponse<Page<ComplaintResponseDTO>>> getMyComplaints(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        complaintService.getUserComplaints(
                                userDetails.getUsername(),
                                PageRequest.of(page, size)
                        )
                )
        );
    }

    /* ------------------------------------------------------- */
    /* Get Complaint By ID                                      */
    /* ------------------------------------------------------- */

    @GetMapping("/{id}")
    @Operation(summary = "Get a complaint by ID")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> getComplaint(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        complaintService.getComplaintById(id)
                )
        );
    }

    /* ------------------------------------------------------- */
    /* Admin APIs                                               */
    /* ------------------------------------------------------- */

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: get all complaints (filterable by status)")
    public ResponseEntity<ApiResponse<Page<ComplaintResponseDTO>>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Page<ComplaintResponseDTO> result =
                (status != null)
                        ? complaintService.getComplaintsByStatus(
                        status,
                        PageRequest.of(page, size)
                )
                        : complaintService.getAllComplaints(
                        PageRequest.of(page, size)
                );

        return ResponseEntity.ok(
                ApiResponse.success(result)
        );
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: update complaint status and resolution")
    public ResponseEntity<ApiResponse<ComplaintResponseDTO>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        ComplaintStatus status =
                ComplaintStatus.valueOf(
                        body.get("status").toUpperCase()
                );

        String resolution =
                body.get("resolution");

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Complaint updated",
                        complaintService.updateComplaintStatus(
                                id,
                                status,
                                resolution,
                                userDetails.getUsername()
                        )
                )
        );
    }
}