// Static dummy data for customer UI - No API calls, no DB, no storage
import { toCamelCase } from './dataMapper';

// Helper to get customer data based on customerId
const getCustomerData = (customerId) => {
  // Map customerId to username for data lookup
  const customerMap = {
    'cust_1': 'john',
    'cust_2': 'sarah',
    'cust_3': 'michael',
    'cust_4': 'emily',
    'cust_5': 'david',
    'cust_6': 'lisa',
    'cust_7': 'robert',
    'cust_8': 'jennifer'
  };

  // Default to cust_1 if not found
  const mappedId = customerId || 'cust_1';
  
  // All policies (snake_case from DB schema)
  const allPolicies = [
    {
      id: 'pol_1',
      policy_number: 'POL-2024-001',
      policy_type: 'Health',
      premium_amount: 450.00,
      start_date: '2024-06-15',
      end_date: '2025-06-15',
      status: 'Active'
    },
    {
      id: 'pol_2',
      policy_number: 'POL-2024-002',
      policy_type: 'Auto',
      premium_amount: 320.50,
      start_date: '2024-08-15',
      end_date: '2025-08-15',
      status: 'Active'
    },
    {
      id: 'pol_3',
      policy_number: 'POL-2024-003',
      policy_type: 'Life',
      premium_amount: 1250.00,
      start_date: '2024-09-01',
      end_date: '2025-09-01',
      status: 'Active'
    },
    {
      id: 'pol_4',
      policy_number: 'POL-2024-004',
      policy_type: 'Home',
      premium_amount: 680.75,
      start_date: '2024-10-15',
      end_date: '2025-10-15',
      status: 'Active'
    },
    {
      id: 'pol_5',
      policy_number: 'POL-2024-005',
      policy_type: 'Travel',
      premium_amount: 150.00,
      start_date: '2024-11-15',
      end_date: '2025-11-15',
      status: 'Active'
    },
    {
      id: 'pol_6',
      policy_number: 'POL-2024-006',
      policy_type: 'Health',
      premium_amount: 520.00,
      start_date: '2024-11-20',
      end_date: '2025-11-20',
      status: 'Active'
    },
    {
      id: 'pol_7',
      policy_number: 'POL-2024-007',
      policy_type: 'Auto',
      premium_amount: 380.25,
      start_date: '2024-11-25',
      end_date: '2025-11-25',
      status: 'Active'
    },
    {
      id: 'pol_8',
      policy_number: 'POL-2024-008',
      policy_type: 'Life',
      premium_amount: 980.50,
      start_date: '2024-11-30',
      end_date: '2025-11-30',
      status: 'Active'
    }
  ];

  // Customer-Policy assignments
  const customerPoliciesMap = {
    'cust_1': ['pol_1', 'pol_2', 'pol_6'], // john - 3 policies
    'cust_2': ['pol_3', 'pol_4', 'pol_8'], // sarah - 3 policies
    'cust_3': ['pol_5', 'pol_7'], // michael - 2 policies
    'cust_4': ['pol_6', 'pol_1'], // emily - 2 policies
    'cust_5': ['pol_7', 'pol_2'], // david - 2 policies
    'cust_6': ['pol_8', 'pol_3'], // lisa - 2 policies
    'cust_7': ['pol_4', 'pol_5'], // robert - 2 policies
    'cust_8': ['pol_1', 'pol_6'] // jennifer - 2 policies
  };

  // All claims (snake_case from DB schema)
  const allClaims = [
    {
      id: 'claim_1',
      customer_id: 'cust_1',
      policy_id: 'pol_1',
      claim_date: '2024-12-03',
      claim_amount: 2500.00,
      status: 'Approved',
      description: 'Medical expenses for emergency surgery. All documents submitted.',
      remarks: 'Claim approved after review. Payment processed.',
      created_at: '2024-12-03T09:00:00Z'
    },
    {
      id: 'claim_2',
      customer_id: 'cust_1',
      policy_id: 'pol_2',
      claim_date: '2024-12-08',
      claim_amount: 3500.00,
      status: 'In Review',
      description: 'Vehicle accident on highway. Police report attached.',
      remarks: 'Under review by claims department.',
      created_at: '2024-12-08T11:00:00Z'
    },
    {
      id: 'claim_9',
      customer_id: 'cust_1',
      policy_id: 'pol_2',
      claim_date: '2024-12-05',
      claim_amount: 1800.00,
      status: 'Approved',
      description: 'Auto repair claim for minor accident.',
      remarks: 'Approved. Repair completed.',
      created_at: '2024-12-05T10:00:00Z'
    },
    {
      id: 'claim_10',
      customer_id: 'cust_1',
      policy_id: 'pol_1',
      claim_date: '2024-11-28',
      claim_amount: 3200.00,
      status: 'Approved',
      description: 'Health insurance claim for dental procedure.',
      remarks: 'Approved after verification.',
      created_at: '2024-11-28T14:00:00Z'
    },
    {
      id: 'claim_3',
      customer_id: 'cust_2',
      policy_id: 'pol_3',
      claim_date: '2024-12-10',
      claim_amount: 15000.00,
      status: 'Submitted',
      description: 'Life insurance claim. Beneficiary documentation provided.',
      remarks: '',
      created_at: '2024-12-10T09:00:00Z'
    },
    {
      id: 'claim_4',
      customer_id: 'cust_2',
      policy_id: 'pol_4',
      claim_date: '2024-11-23',
      claim_amount: 8500.00,
      status: 'Approved',
      description: 'Home damage due to storm. Inspection completed.',
      remarks: 'Approved. Settlement amount processed.',
      created_at: '2024-11-23T10:00:00Z'
    },
    {
      id: 'claim_11',
      customer_id: 'cust_2',
      policy_id: 'pol_4',
      claim_date: '2024-12-07',
      claim_amount: 4200.00,
      status: 'In Review',
      description: 'Home insurance claim for water damage.',
      remarks: 'Assessment in progress.',
      created_at: '2024-12-07T11:00:00Z'
    },
    {
      id: 'claim_5',
      customer_id: 'cust_3',
      policy_id: 'pol_5',
      claim_date: '2024-12-11',
      claim_amount: 1200.00,
      status: 'Rejected',
      description: 'Travel insurance claim for cancelled trip.',
      remarks: 'Claim rejected. Trip cancellation not covered under policy terms.',
      created_at: '2024-12-11T08:00:00Z'
    },
    {
      id: 'claim_12',
      customer_id: 'cust_3',
      policy_id: 'pol_5',
      claim_date: '2024-12-09',
      claim_amount: 800.00,
      status: 'Submitted',
      description: 'Travel insurance claim for lost baggage.',
      remarks: '',
      created_at: '2024-12-09T12:00:00Z'
    },
    {
      id: 'claim_13',
      customer_id: 'cust_3',
      policy_id: 'pol_7',
      claim_date: '2024-11-25',
      claim_amount: 2800.00,
      status: 'Approved',
      description: 'Auto insurance claim for windshield replacement.',
      remarks: 'Approved and processed.',
      created_at: '2024-11-25T15:00:00Z'
    },
    {
      id: 'claim_6',
      customer_id: 'cust_4',
      policy_id: 'pol_6',
      claim_date: '2024-12-06',
      claim_amount: 3200.00,
      status: 'In Review',
      description: 'Health insurance claim for hospital stay.',
      remarks: 'Medical records under review.',
      created_at: '2024-12-06T10:00:00Z'
    },
    {
      id: 'claim_14',
      customer_id: 'cust_4',
      policy_id: 'pol_6',
      claim_date: '2024-12-04',
      claim_amount: 1500.00,
      status: 'In Review',
      description: 'Health insurance claim for prescription medication.',
      remarks: 'Medical records under review.',
      created_at: '2024-12-04T09:00:00Z'
    },
    {
      id: 'claim_7',
      customer_id: 'cust_5',
      policy_id: 'pol_7',
      claim_date: '2024-12-12',
      claim_amount: 4500.00,
      status: 'Submitted',
      description: 'Auto insurance claim for vehicle damage.',
      remarks: '',
      created_at: '2024-12-12T11:00:00Z'
    },
    {
      id: 'claim_15',
      customer_id: 'cust_5',
      policy_id: 'pol_7',
      claim_date: '2024-12-02',
      claim_amount: 5600.00,
      status: 'Approved',
      description: 'Auto insurance claim for major collision repair.',
      remarks: 'All repairs completed. Claim approved.',
      created_at: '2024-12-02T13:00:00Z'
    },
    {
      id: 'claim_8',
      customer_id: 'cust_6',
      policy_id: 'pol_8',
      claim_date: '2024-12-01',
      claim_amount: 9500.00,
      status: 'Approved',
      description: 'Life insurance claim processed successfully.',
      remarks: 'All documentation verified. Payment approved.',
      created_at: '2024-12-01T10:00:00Z'
    },
    {
      id: 'claim_16',
      customer_id: 'cust_6',
      policy_id: 'pol_8',
      claim_date: '2024-11-29',
      claim_amount: 12000.00,
      status: 'Approved',
      description: 'Life insurance claim - beneficiary payment.',
      remarks: 'All documentation verified.',
      created_at: '2024-11-29T14:00:00Z'
    },
    {
      id: 'claim_17',
      customer_id: 'cust_6',
      policy_id: 'pol_3',
      claim_date: '2024-11-27',
      claim_amount: 7500.00,
      status: 'Rejected',
      description: 'Life insurance claim - policy terms not met.',
      remarks: 'Claim rejected. Policy terms and conditions not satisfied.',
      created_at: '2024-11-27T09:00:00Z'
    },
    {
      id: 'claim_18',
      customer_id: 'cust_7',
      policy_id: 'pol_4',
      claim_date: '2024-11-30',
      claim_amount: 3800.00,
      status: 'Approved',
      description: 'Home insurance claim for roof damage.',
      remarks: 'Inspection completed. Claim approved.',
      created_at: '2024-11-30T11:00:00Z'
    },
    {
      id: 'claim_19',
      customer_id: 'cust_8',
      policy_id: 'pol_1',
      claim_date: '2024-12-06',
      claim_amount: 2100.00,
      status: 'Submitted',
      description: 'Health insurance claim for specialist consultation.',
      remarks: '',
      created_at: '2024-12-06T10:00:00Z'
    },
    {
      id: 'claim_20',
      customer_id: 'cust_8',
      policy_id: 'pol_6',
      claim_date: '2024-11-24',
      claim_amount: 4900.00,
      status: 'In Review',
      description: 'Health insurance claim for surgery expenses.',
      remarks: 'Medical records verification in progress.',
      created_at: '2024-11-24T13:00:00Z'
    }
  ];

  // Get policies for this customer
  const policyIds = customerPoliciesMap[mappedId] || customerPoliciesMap['cust_1'];
  const customerPolicies = allPolicies
    .filter(p => policyIds.includes(p.id))
    .map(toCamelCase);

  // Get claims for this customer
  const customerClaims = allClaims
    .filter(c => c.customer_id === mappedId)
    .map(claim => {
      const camelClaim = toCamelCase(claim);
      const policy = allPolicies.find(p => p.id === claim.policy_id);
      return {
        ...camelClaim,
        claimNumber: `CLM-2024-${String(claim.id.replace('claim_', '')).padStart(3, '0')}`,
        policyNumber: policy?.policy_number || 'N/A',
        createdAt: claim.created_at
      };
    });

  return {
    policies: customerPolicies,
    claims: customerClaims
  };
};

// Export function to get customer policies
export const getCustomerPoliciesData = (customerId) => {
  const data = getCustomerData(customerId);
  return data.policies;
};

// Export function to get customer claims
export const getCustomerClaimsData = (customerId) => {
  const data = getCustomerData(customerId);
  return data.claims;
};

// Export function to get dashboard stats
export const getCustomerDashboardStats = (customerId) => {
  const data = getCustomerData(customerId);
  const policies = data.policies;
  const claims = data.claims;
  
  return {
    totalPolicies: policies.length,
    activePolicies: policies.filter(p => p.status === 'Active').length,
    totalClaims: claims.length,
    pendingClaims: claims.filter(c => c.status === 'Submitted' || c.status === 'In Review').length,
    approvedClaims: claims.filter(c => c.status === 'Approved').length
  };
};

