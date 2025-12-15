package com.capstone.insurance.services.impl;

import com.capstone.insurance.dto.customer.CustomerCreateRequest;
import com.capstone.insurance.dto.customer.CustomerDto;
import com.capstone.insurance.entities.Customer;
import com.capstone.insurance.entities.User;
import com.capstone.insurance.entities.enums.Role;
import com.capstone.insurance.exceptions.BadRequestException;
import com.capstone.insurance.exceptions.ResourceNotFoundException;
import com.capstone.insurance.repositories.CustomerRepository;
import com.capstone.insurance.repositories.UserRepository;
import com.capstone.insurance.services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public CustomerDto createCustomer(CustomerCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Customer with email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .enabled(true)
                .build();
        userRepository.save(user);

        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .user(user)
                .build();
        customerRepository.save(customer);

        return toDto(customer);
    }

    @Override
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerDto getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
        return toDto(customer);
    }

    private CustomerDto toDto(Customer c) {
        return CustomerDto.builder()
                .id(c.getId())
                .name(c.getName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .build();
    }
}
