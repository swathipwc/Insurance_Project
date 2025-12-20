package com.capstone.insurance.services.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import com.capstone.insurance.dto.policy.AssignPolicyRequest;
import com.capstone.insurance.entities.*;
import com.capstone.insurance.exceptions.BadRequestException;
import com.capstone.insurance.repositories.*;

@ExtendWith(MockitoExtension.class)
class PolicyServiceImplTest {

    @Mock PolicyRepository policyRepository;
    @Mock CustomerRepository customerRepository;
    @Mock CustomerPolicyRepository customerPolicyRepository;

    @InjectMocks PolicyServiceImpl policyService;

    // 1) Duplicate assignment should be rejected
    @Test
    void assignPolicyToCustomer_shouldRejectIfAlreadyAssigned() {
        UUID customerId = UUID.randomUUID();
        UUID policyId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        Policy policy = new Policy();
        policy.setId(policyId);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(policy));
        when(customerPolicyRepository.existsByCustomerIdAndPolicyId(customerId, policyId)).thenReturn(true);

        AssignPolicyRequest req = new AssignPolicyRequest();
        req.setPolicyId(policyId);

        assertThrows(BadRequestException.class,
                () -> policyService.assignPolicyToCustomer(customerId, req));

        verify(customerPolicyRepository, never()).save(any());
    }

    // 2) Customer not found should be rejected
    @Test
    void assignPolicyToCustomer_shouldRejectIfCustomerNotFound() {
        UUID customerId = UUID.randomUUID();
        UUID policyId = UUID.randomUUID();

        when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

        AssignPolicyRequest req = new AssignPolicyRequest();
        req.setPolicyId(policyId);

        assertThrows(RuntimeException.class,
                () -> policyService.assignPolicyToCustomer(customerId, req));

        verify(policyRepository, never()).findById(any());
        verify(customerPolicyRepository, never()).save(any());
    }

    // 3) Policy not found should be rejected
    @Test
    void assignPolicyToCustomer_shouldRejectIfPolicyNotFound() {
        UUID customerId = UUID.randomUUID();
        UUID policyId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(policyRepository.findById(policyId)).thenReturn(Optional.empty());

        AssignPolicyRequest req = new AssignPolicyRequest();
        req.setPolicyId(policyId);

        assertThrows(RuntimeException.class,
                () -> policyService.assignPolicyToCustomer(customerId, req));

        verify(customerPolicyRepository, never()).save(any());
    }

    // 4) Null request should be rejected
    @Test
    void assignPolicyToCustomer_shouldRejectIfRequestIsNull() {
        UUID customerId = UUID.randomUUID();

        assertThrows(RuntimeException.class,
                () -> policyService.assignPolicyToCustomer(customerId, null));

        verify(customerPolicyRepository, never()).save(any());
    }

    // 5) Happy path should save CustomerPolicy
    @Test
    void assignPolicyToCustomer_shouldSaveCustomerPolicyWhenValid() {
        UUID customerId = UUID.randomUUID();
        UUID policyId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        Policy policy = new Policy();
        policy.setId(policyId);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(policy));
        when(customerPolicyRepository.existsByCustomerIdAndPolicyId(customerId, policyId)).thenReturn(false);

        when(customerPolicyRepository.save(any(CustomerPolicy.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AssignPolicyRequest req = new AssignPolicyRequest();
        req.setPolicyId(policyId);

        assertDoesNotThrow(() -> policyService.assignPolicyToCustomer(customerId, req));
        verify(customerPolicyRepository, times(1)).save(any(CustomerPolicy.class));
    }

    // 6) Duplicate check must occur before save
    @Test
    void assignPolicyToCustomer_shouldCheckDuplicateBeforeSave() {
        UUID customerId = UUID.randomUUID();
        UUID policyId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        Policy policy = new Policy();
        policy.setId(policyId);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(policy));
        when(customerPolicyRepository.existsByCustomerIdAndPolicyId(customerId, policyId)).thenReturn(false);

        when(customerPolicyRepository.save(any(CustomerPolicy.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AssignPolicyRequest req = new AssignPolicyRequest();
        req.setPolicyId(policyId);

        assertDoesNotThrow(() -> policyService.assignPolicyToCustomer(customerId, req));

        InOrder order = inOrder(customerPolicyRepository);
        order.verify(customerPolicyRepository)
             .existsByCustomerIdAndPolicyId(customerId, policyId);
        order.verify(customerPolicyRepository).save(any(CustomerPolicy.class));
    }

    // 7) No save should happen if duplicate is detected
    @Test
    void assignPolicyToCustomer_shouldNotSaveWhenDuplicateDetected() {
        UUID customerId = UUID.randomUUID();
        UUID policyId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        Policy policy = new Policy();
        policy.setId(policyId);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(policyRepository.findById(policyId)).thenReturn(Optional.of(policy));
        when(customerPolicyRepository.existsByCustomerIdAndPolicyId(customerId, policyId)).thenReturn(true);

        AssignPolicyRequest req = new AssignPolicyRequest();
        req.setPolicyId(policyId);

        assertThrows(BadRequestException.class,
                () -> policyService.assignPolicyToCustomer(customerId, req));

        verify(customerPolicyRepository, never()).save(any());
    }

    // 8) If policy lookup fails, duplicate check must not be executed
    @Test
    void assignPolicyToCustomer_shouldNotCheckDuplicateIfPolicyNotFound() {
        UUID customerId = UUID.randomUUID();
        UUID policyId = UUID.randomUUID();

        Customer customer = new Customer();
        customer.setId(customerId);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(policyRepository.findById(policyId)).thenReturn(Optional.empty());

        AssignPolicyRequest req = new AssignPolicyRequest();
        req.setPolicyId(policyId);

        assertThrows(RuntimeException.class,
                () -> policyService.assignPolicyToCustomer(customerId, req));

        verify(customerPolicyRepository, never())
                .existsByCustomerIdAndPolicyId(any(), any());
        verify(customerPolicyRepository, never()).save(any());
    }
}
