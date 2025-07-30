package uz.encode.ecommerce.Address.service;


import uz.encode.ecommerce.Address.dto.AddressCreateDTO;
import uz.encode.ecommerce.Address.dto.AddressResponseDTO;

import java.util.List;
import java.util.UUID;

public interface AddressService {
    AddressResponseDTO create(AddressCreateDTO dto);
    List<AddressResponseDTO> getByUserId(UUID userId);
    AddressResponseDTO update(UUID id, AddressCreateDTO dto);
    void delete(UUID id);
    List<AddressResponseDTO> findAll();
}
