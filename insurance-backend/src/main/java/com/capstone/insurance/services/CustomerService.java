package com.capstone.insurance.services;

import com.capstone.insurance.dto.customer.CustomerCreateRequest;
import com.capstone.insurance.dto.customer.CustomerDto;

import java.util.List;

public interface CustomerService {

    CustomerDto createCustomer(CustomerCreateRequest request);

    List<CustomerDto> getAllCustomers();

    CustomerDto getCustomerById(Long id);
}
