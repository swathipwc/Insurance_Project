package com.capstone.insurance;

import com.capstone.insurance.entities.Customer;
import com.capstone.insurance.entities.User;
import com.capstone.insurance.entities.enums.Role;
import com.capstone.insurance.repositories.CustomerRepository;
import com.capstone.insurance.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.UUID;

@SpringBootApplication
public class InsuranceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsuranceApplication.class, args);
    }

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository,
                                CustomerRepository customerRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            LocalDateTime now = LocalDateTime.now();
            
            // Create admin user
            if (!userRepository.existsByUsername("admin@exe.in")) {
                User admin = User.builder()
                        .username("admin@exe.in")
                        .password(passwordEncoder.encode("Admin@123"))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                userRepository.save(admin);
                System.out.println("Admin user created: admin@exe.in");
            }

            // Create customer user and customer record
            if (!userRepository.existsByUsername("customer@exe.in")) {
                User customerUser = User.builder()
                        .username("customer@exe.in")
                        .password(passwordEncoder.encode("Admin@123"))
                        .role(Role.CUSTOMER)
                        .enabled(true)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                userRepository.save(customerUser);

                // Create customer record
                Customer customer = Customer.builder()
                        .id(UUID.randomUUID())
                        .customerCode("CUS0001")
                        .name("Customer User")
                        .email("customer@exe.in")
                        .phone("1234567890")
                        .address("Customer Address")
                        .user(customerUser)
                        .createdAt(now)
                        .updatedAt(now)
                        .build();
                customerRepository.save(customer);
                System.out.println("Customer user created: customer@exe.in");
            }

            // Tables will be created automatically by Hibernate (ddl-auto: update)
            System.out.println("Data initialization completed. Tables created by Hibernate.");
        };
    }
}
