package com.capstone.insurance;

import com.capstone.insurance.entities.User;
import com.capstone.insurance.entities.enums.Role;
import com.capstone.insurance.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class InsuranceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InsuranceApplication.class, args);
    }

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
            }

            if (!userRepository.existsByUsername("customer1")) {
                User customer = User.builder()
                        .username("customer1")
                        .password(passwordEncoder.encode("cust123"))
                        .role(Role.CUSTOMER)
                        .enabled(true)
                        .build();
                userRepository.save(customer);
            }
        };
    }
}
