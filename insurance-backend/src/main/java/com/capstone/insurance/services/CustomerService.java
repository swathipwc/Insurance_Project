package com.capstone.insurance.services;

import com.capstone.insurance.dto.common.PaginatedResponse;
import com.capstone.insurance.dto.customer.CustomerCreateRequest;
import com.capstone.insurance.dto.customer.CustomerDto;
import com.capstone.insurance.dto.customer.CustomerUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface CustomerService {

    CustomerDto createCustomer(CustomerCreateRequest request);

    List<CustomerDto> getAllCustomers();

    PaginatedResponse<CustomerDto> getAllCustomersPaginated(int page);

    CustomerDto getCustomerById(UUID id);

    CustomerDto updateCustomer(UUID id, CustomerUpdateRequest request);
}
