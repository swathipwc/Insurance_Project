package com.capstone.insurance.security;

import com.capstone.insurance.entities.Customer;
import com.capstone.insurance.entities.User;
import com.capstone.insurance.repositories.CustomerRepository;
import com.capstone.insurance.repositories.UserRepository;
import com.capstone.insurance.security.model.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail)
            throws UsernameNotFoundException {

        // First try to find by username
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        
        // If not found by username, try to find by email (for customers)
        if (userOpt.isEmpty()) {
            Optional<Customer> customerOpt = customerRepository.findByEmail(usernameOrEmail);
            if (customerOpt.isPresent()) {
                userOpt = Optional.of(customerOpt.get().getUser());
            }
        }

        User user = userOpt.orElseThrow(() ->
                new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));

        return new UserPrincipal(user);
    }
}
