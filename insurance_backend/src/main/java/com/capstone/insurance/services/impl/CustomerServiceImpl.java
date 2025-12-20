package com.capstone.insurance.services.impl;

import com.capstone.insurance.dto.common.PaginatedResponse;
import com.capstone.insurance.dto.customer.CustomerCreateRequest;
import com.capstone.insurance.dto.customer.CustomerDto;
import com.capstone.insurance.dto.customer.CustomerUpdateRequest;
import com.capstone.insurance.entities.Customer;
import com.capstone.insurance.entities.User;
import com.capstone.insurance.entities.enums.Role;
import com.capstone.insurance.exceptions.BadRequestException;
import com.capstone.insurance.exceptions.ResourceNotFoundException;
import com.capstone.insurance.repositories.CustomerRepository;
import com.capstone.insurance.repositories.UserRepository;
import com.capstone.insurance.services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final String DEFAULT_PASSWORD = "Admin@123";
    private static final Random random = new Random();

    @Override
    @Transactional
    public CustomerDto createCustomer(CustomerCreateRequest request) {
        // Check if email already exists
        if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Customer with email already exists");
        }

        // Generate customer code (CUS0001, CUS0002, etc.)
        String customerCode = generateCustomerCode();

        // Generate username based on name + 5 digit number
        String username = generateUsername(request.getName());

        // Ensure username is unique
        int attempts = 0;
        while (userRepository.existsByUsername(username) && attempts < 10) {
            username = generateUsername(request.getName());
            attempts++;
        }
        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Unable to generate unique username. Please try again.");
        }

        // Create user with auto-generated password and timestamps
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .role(Role.CUSTOMER)
                .enabled(true)
                .createdAt(now)
                .updatedAt(now)
                .build();
        userRepository.save(user);

        // Create customer with auto-generated UUID and timestamps (reuse same timestamp)
        Customer customer = Customer.builder()
                .id(UUID.randomUUID())
                .customerCode(customerCode)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .user(user)
                .createdAt(now)
                .updatedAt(now)
                .build();
        customerRepository.save(customer);

        return toDto(customer);
    }

    private String generateCustomerCode() {
        Optional<Customer> lastCustomer = customerRepository.findTopByOrderByCustomerCodeDesc();
        
        if (lastCustomer.isEmpty()) {
            return "CUS0001";
        }
        
        String lastCode = lastCustomer.get().getCustomerCode();
        if (lastCode == null || !lastCode.startsWith("CUS")) {
            return "CUS0001";
        }
        
        try {
            int number = Integer.parseInt(lastCode.substring(3));
            number++;
            return String.format("CUS%04d", number);
        } catch (NumberFormatException e) {
            return "CUS0001";
        }
    }

    private String generateUsername(String name) {
        // Clean name: remove spaces, special characters, convert to lowercase
        String cleanName = name.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        
        // Take first 10 characters of name (or all if less)
        String namePart = cleanName.length() > 10 ? cleanName.substring(0, 10) : cleanName;
        
        // Generate 5 digit random number
        int randomNumber = 10000 + random.nextInt(90000);
        
        return namePart + randomNumber;
    }

    @Override
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PaginatedResponse<CustomerDto> getAllCustomersPaginated(int page) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Customer> customerPage = customerRepository.findAll(pageable);
        
        List<CustomerDto> content = customerPage.getContent()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        
        return PaginatedResponse.<CustomerDto>builder()
                .content(content)
                .currentPage(page)
                .pageSize(10)
                .totalElements(customerPage.getTotalElements())
                .totalPages(customerPage.getTotalPages())
                .hasNext(customerPage.hasNext())
                .hasPrevious(customerPage.hasPrevious())
                .build();
    }

    @Override
    public CustomerDto getCustomerById(UUID id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
        return toDto(customer);
    }

    @Override
    @Transactional
    public CustomerDto updateCustomer(UUID id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));

        // Check if email is being changed and if new email already exists for another customer
        if (!customer.getEmail().equals(request.getEmail())) {
            Optional<Customer> existingCustomer = customerRepository.findByEmail(request.getEmail());
            if (existingCustomer.isPresent() && !existingCustomer.get().getId().equals(customer.getId())) {
                throw new BadRequestException("Customer with email already exists");
            }
        }

        // Update only the allowed fields: name, email, phone, address
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        customerRepository.save(customer);

        return toDto(customer);
    }

    private CustomerDto toDto(Customer c) {
        return CustomerDto.builder()
                .id(c.getId())
                .customerCode(c.getCustomerCode())
                .name(c.getName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .address(c.getAddress())
                .username(c.getUser().getUsername())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
