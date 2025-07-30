package uz.encode.ecommerce.Address.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.encode.ecommerce.Address.dto.AddressCreateDTO;
import uz.encode.ecommerce.Address.dto.AddressResponseDTO;
import uz.encode.ecommerce.Address.service.AddressService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Tag(name = "Address", description = "User address management")
public class AddressController {

    private final AddressService addressService;

    @Operation(summary = "Get all addresses")
    @GetMapping
    public ResponseEntity<List<AddressResponseDTO>> findAll() {
        return ResponseEntity.ok(addressService.findAll());
    }

    @Operation(summary = "Save user address")
    @PostMapping
    public ResponseEntity<AddressResponseDTO> create(@Valid @RequestBody AddressCreateDTO dto) {
        return ResponseEntity.ok(addressService.create(dto));
    }

    @Operation(summary = "Get Address By User ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponseDTO>> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(addressService.getByUserId(userId));
    }

    @Operation(summary = "Update Address")
    @PutMapping("/{id}")
    public ResponseEntity<AddressResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody AddressCreateDTO dto) {
        return ResponseEntity.ok(addressService.update(id, dto));
    }

    @Operation(summary = "Delete Address")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        addressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}