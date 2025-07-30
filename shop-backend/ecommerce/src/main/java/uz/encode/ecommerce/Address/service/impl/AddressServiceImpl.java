package uz.encode.ecommerce.Address.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uz.encode.ecommerce.Address.dto.AddressCreateDTO;
import uz.encode.ecommerce.Address.dto.AddressResponseDTO;
import uz.encode.ecommerce.Address.entity.Address;
import uz.encode.ecommerce.Address.repository.AddressRepository;
import uz.encode.ecommerce.Address.service.AddressService;
import uz.encode.ecommerce.User.entity.User;
import uz.encode.ecommerce.User.repository.UserRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public AddressResponseDTO create(AddressCreateDTO dto) {
        User user = userRepository.findById(UUID.fromString(dto.getUserId()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = new Address();
        address.setCity(dto.getCity());
        address.setRegion(dto.getRegion());
        address.setStreet(dto.getStreet());
        address.setZipCode(dto.getZipCode());
        address.setUser(user);

        return mapToDto(addressRepository.save(address));
    }

    @Override
    public List<AddressResponseDTO> getByUserId(UUID userId) {
        return addressRepository.findAllByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponseDTO update(UUID id, AddressCreateDTO dto) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setCity(dto.getCity());
        address.setRegion(dto.getRegion());
        address.setStreet(dto.getStreet());
        address.setZipCode(dto.getZipCode());

        return mapToDto(addressRepository.save(address));
    }

    @Override
    public void delete(UUID id) {
        addressRepository.deleteById(id);
    }

    @Override
    public List<AddressResponseDTO> findAll() {
        return addressRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private AddressResponseDTO mapToDto(Address address) {
        AddressResponseDTO dto = new AddressResponseDTO();
        dto.setId(address.getId());
        dto.setCity(address.getCity());
        dto.setRegion(address.getRegion());
        dto.setStreet(address.getStreet());
        dto.setZipCode(address.getZipCode());
        dto.setUserId(address.getUser().getId());
        return dto;
    }
}
