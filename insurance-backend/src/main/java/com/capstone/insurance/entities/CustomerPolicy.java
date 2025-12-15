package com.capstone.insurance.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "customer_policies",
    uniqueConstraints = @UniqueConstraint(columnNames = {"customer_id", "policy_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id")
    private Policy policy;
}
