// Initial dummy data for the application - Matching exact DB schema

// Users table: id, username, password_hash, role
export const getInitialUsers = () => [
  {
    id: 'user_1',
    username: 'admin',
    password_hash: '$2b$10$hashed_password_admin', // Hashed password
    role: 'Admin'
  },
  {
    id: 'user_2',
    username: 'john',
    password_hash: '$2b$10$hashed_password_john',
    role: 'Customer'
  },
  {
    id: 'user_3',
    username: 'sarah',
    password_hash: '$2b$10$hashed_password_sarah',
    role: 'Customer'
  },
  {
    id: 'user_4',
    username: 'michael',
    password_hash: '$2b$10$hashed_password_michael',
    role: 'Customer'
  },
  {
    id: 'user_5',
    username: 'emily',
    password_hash: '$2b$10$hashed_password_emily',
    role: 'Customer'
  },
  {
    id: 'user_6',
    username: 'david',
    password_hash: '$2b$10$hashed_password_david',
    role: 'Customer'
  },
  {
    id: 'user_7',
    username: 'lisa',
    password_hash: '$2b$10$hashed_password_lisa',
    role: 'Customer'
  },
  {
    id: 'user_8',
    username: 'robert',
    password_hash: '$2b$10$hashed_password_robert',
    role: 'Customer'
  },
  {
    id: 'user_9',
    username: 'jennifer',
    password_hash: '$2b$10$hashed_password_jennifer',
    role: 'Customer'
  }
];

// Customers table: id, name, email, phone, linked_user_id
export const getInitialCustomers = () => [
  {
    id: 'cust_1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-0101',
    linked_user_id: 'user_2'
  },
  {
    id: 'cust_2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '555-0102',
    linked_user_id: 'user_3'
  },
  {
    id: 'cust_3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '555-0103',
    linked_user_id: 'user_4'
  },
  {
    id: 'cust_4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '555-0104',
    linked_user_id: 'user_5'
  },
  {
    id: 'cust_5',
    name: 'David Wilson',
    email: 'david.w@email.com',
    phone: '555-0105',
    linked_user_id: 'user_6'
  },
  {
    id: 'cust_6',
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    phone: '555-0106',
    linked_user_id: 'user_7'
  },
  {
    id: 'cust_7',
    name: 'Robert Taylor',
    email: 'robert.t@email.com',
    phone: '555-0107',
    linked_user_id: 'user_8'
  },
  {
    id: 'cust_8',
    name: 'Jennifer Martinez',
    email: 'jennifer.m@email.com',
    phone: '555-0108',
    linked_user_id: 'user_9'
  }
];

// Policies table: id, policy_number, policy_type, premium_amount, start_date, end_date, status
export const getInitialPolicies = () => [
  {
    id: 'pol_1',
    policy_number: 'POL-2024-001',
    policy_type: 'Health',
    premium_amount: 450.00,
    start_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active'
  },
  {
    id: 'pol_2',
    policy_number: 'POL-2024-002',
    policy_type: 'Auto',
    premium_amount: 320.50,
    start_date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active'
  },
  {
    id: 'pol_3',
    policy_number: 'POL-2024-003',
    policy_type: 'Life',
    premium_amount: 1250.00,
    start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active'
  },
  {
    id: 'pol_4',
    policy_number: 'POL-2024-004',
    policy_type: 'Home',
    premium_amount: 680.75,
    start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active'
  },
  {
    id: 'pol_5',
    policy_number: 'POL-2024-005',
    policy_type: 'Travel',
    premium_amount: 150.00,
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active'
  },
  {
    id: 'pol_6',
    policy_number: 'POL-2024-006',
    policy_type: 'Health',
    premium_amount: 520.00,
    start_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active'
  },
  {
    id: 'pol_7',
    policy_number: 'POL-2024-007',
    policy_type: 'Auto',
    premium_amount: 380.25,
    start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 345 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active'
  },
  {
    id: 'pol_8',
    policy_number: 'POL-2024-008',
    policy_type: 'Life',
    premium_amount: 980.50,
    start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active'
  },
  {
    id: 'pol_9',
    policy_number: 'POL-2023-101',
    policy_type: 'Auto',
    premium_amount: 280.00,
    start_date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Expired'
  },
  {
    id: 'pol_10',
    policy_number: 'POL-2023-102',
    policy_type: 'Health',
    premium_amount: 420.00,
    start_date: new Date(Date.now() - 380 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Expired'
  }
];

// Customer_policies table: id, customer_id, policy_id
export const getInitialCustomerPolicies = () => [
  // Customer 1 (john) - 3 policies
  { id: 'cp_1', customer_id: 'cust_1', policy_id: 'pol_1' },
  { id: 'cp_2', customer_id: 'cust_1', policy_id: 'pol_2' },
  { id: 'cp_3', customer_id: 'cust_1', policy_id: 'pol_6' },
  // Customer 2 (sarah) - 3 policies
  { id: 'cp_4', customer_id: 'cust_2', policy_id: 'pol_3' },
  { id: 'cp_5', customer_id: 'cust_2', policy_id: 'pol_4' },
  { id: 'cp_6', customer_id: 'cust_2', policy_id: 'pol_8' },
  // Customer 3 (michael) - 2 policies
  { id: 'cp_7', customer_id: 'cust_3', policy_id: 'pol_5' },
  { id: 'cp_8', customer_id: 'cust_3', policy_id: 'pol_7' },
  // Customer 4 (emily) - 2 policies
  { id: 'cp_9', customer_id: 'cust_4', policy_id: 'pol_6' },
  { id: 'cp_10', customer_id: 'cust_4', policy_id: 'pol_1' },
  // Customer 5 (david) - 2 policies
  { id: 'cp_11', customer_id: 'cust_5', policy_id: 'pol_7' },
  { id: 'cp_12', customer_id: 'cust_5', policy_id: 'pol_2' },
  // Customer 6 (lisa) - 2 policies
  { id: 'cp_13', customer_id: 'cust_6', policy_id: 'pol_8' },
  { id: 'cp_14', customer_id: 'cust_6', policy_id: 'pol_3' },
  // Customer 7 (robert) - 2 policies
  { id: 'cp_15', customer_id: 'cust_7', policy_id: 'pol_4' },
  { id: 'cp_16', customer_id: 'cust_7', policy_id: 'pol_5' },
  // Customer 8 (jennifer) - 2 policies
  { id: 'cp_17', customer_id: 'cust_8', policy_id: 'pol_1' },
  { id: 'cp_18', customer_id: 'cust_8', policy_id: 'pol_6' }
];

// Claims table: id, customer_id, policy_id, claim_date, claim_amount, status, description, remarks, created_at
export const getInitialClaims = () => [
  {
    id: 'claim_1',
    customer_id: 'cust_1',
    policy_id: 'pol_1',
    claim_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 2500.00,
    status: 'Approved',
    description: 'Medical expenses for emergency surgery. All documents submitted.',
    remarks: 'Claim approved after review. Payment processed.',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_2',
    customer_id: 'cust_1',
    policy_id: 'pol_2',
    claim_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 3500.00,
    status: 'In Review',
    description: 'Vehicle accident on highway. Police report attached.',
    remarks: 'Under review by claims department.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_3',
    customer_id: 'cust_2',
    policy_id: 'pol_3',
    claim_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 15000.00,
    status: 'Submitted',
    description: 'Life insurance claim. Beneficiary documentation provided.',
    remarks: '',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_4',
    customer_id: 'cust_2',
    policy_id: 'pol_4',
    claim_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 8500.00,
    status: 'Approved',
    description: 'Home damage due to storm. Inspection completed.',
    remarks: 'Approved. Settlement amount processed.',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_5',
    customer_id: 'cust_3',
    policy_id: 'pol_5',
    claim_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 1200.00,
    status: 'Rejected',
    description: 'Travel insurance claim for cancelled trip.',
    remarks: 'Claim rejected. Trip cancellation not covered under policy terms.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_6',
    customer_id: 'cust_4',
    policy_id: 'pol_6',
    claim_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 3200.00,
    status: 'In Review',
    description: 'Health insurance claim for hospital stay.',
    remarks: 'Medical records under review.',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_7',
    customer_id: 'cust_5',
    policy_id: 'pol_7',
    claim_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 4500.00,
    status: 'Submitted',
    description: 'Auto insurance claim for vehicle damage.',
    remarks: '',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_8',
    customer_id: 'cust_6',
    policy_id: 'pol_8',
    claim_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 9500.00,
    status: 'Approved',
    description: 'Life insurance claim processed successfully.',
    remarks: 'All documentation verified. Payment approved.',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  // More claims for customer 1 (john)
  {
    id: 'claim_9',
    customer_id: 'cust_1',
    policy_id: 'pol_2',
    claim_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 1800.00,
    status: 'Approved',
    description: 'Auto repair claim for minor accident.',
    remarks: 'Approved. Repair completed.',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_10',
    customer_id: 'cust_1',
    policy_id: 'pol_1',
    claim_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 3200.00,
    status: 'Approved',
    description: 'Health insurance claim for dental procedure.',
    remarks: 'Approved after verification.',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  // More claims for customer 2 (sarah)
  {
    id: 'claim_11',
    customer_id: 'cust_2',
    policy_id: 'pol_4',
    claim_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 4200.00,
    status: 'In Review',
    description: 'Home insurance claim for water damage.',
    remarks: 'Assessment in progress.',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  // More claims for customer 3 (michael)
  {
    id: 'claim_12',
    customer_id: 'cust_3',
    policy_id: 'pol_5',
    claim_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 800.00,
    status: 'Submitted',
    description: 'Travel insurance claim for lost baggage.',
    remarks: '',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_13',
    customer_id: 'cust_3',
    policy_id: 'pol_7',
    claim_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 2800.00,
    status: 'Approved',
    description: 'Auto insurance claim for windshield replacement.',
    remarks: 'Approved and processed.',
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  // More claims for customer 4 (emily)
  {
    id: 'claim_14',
    customer_id: 'cust_4',
    policy_id: 'pol_6',
    claim_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 1500.00,
    status: 'In Review',
    description: 'Health insurance claim for prescription medication.',
    remarks: 'Medical records under review.',
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  // More claims for customer 5 (david)
  {
    id: 'claim_15',
    customer_id: 'cust_5',
    policy_id: 'pol_7',
    claim_date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 5600.00,
    status: 'Approved',
    description: 'Auto insurance claim for major collision repair.',
    remarks: 'All repairs completed. Claim approved.',
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString()
  },
  // More claims for customer 6 (lisa)
  {
    id: 'claim_16',
    customer_id: 'cust_6',
    policy_id: 'pol_8',
    claim_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 12000.00,
    status: 'Approved',
    description: 'Life insurance claim - beneficiary payment.',
    remarks: 'All documentation verified.',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_17',
    customer_id: 'cust_6',
    policy_id: 'pol_3',
    claim_date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 7500.00,
    status: 'Rejected',
    description: 'Life insurance claim - policy terms not met.',
    remarks: 'Claim rejected. Policy terms and conditions not satisfied.',
    created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Claims for customer 7 (robert)
  {
    id: 'claim_18',
    customer_id: 'cust_7',
    policy_id: 'pol_4',
    claim_date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 3800.00,
    status: 'Approved',
    description: 'Home insurance claim for roof damage.',
    remarks: 'Inspection completed. Claim approved.',
    created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
  },
  // Claims for customer 8 (jennifer)
  {
    id: 'claim_19',
    customer_id: 'cust_8',
    policy_id: 'pol_1',
    claim_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 2100.00,
    status: 'Submitted',
    description: 'Health insurance claim for specialist consultation.',
    remarks: '',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'claim_20',
    customer_id: 'cust_8',
    policy_id: 'pol_6',
    claim_date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    claim_amount: 4900.00,
    status: 'In Review',
    description: 'Health insurance claim for surgery expenses.',
    remarks: 'Medical records verification in progress.',
    created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const getInitialActivityLogs = () => [
  {
    id: 'act_1',
    action: 'Policy Created',
    entityType: 'Policy',
    entityId: 'pol_1',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_2',
    action: 'Claim Submitted',
    entityType: 'Claim',
    entityId: 'claim_1',
    userId: 'cust_1',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_3',
    action: 'Claim Approved',
    entityType: 'Claim',
    entityId: 'claim_1',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_4',
    action: 'Customer Created',
    entityType: 'Customer',
    entityId: 'cust_1',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_5',
    action: 'Policy Assigned',
    entityType: 'Policy',
    entityId: 'pol_1',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_6',
    action: 'Claim Submitted',
    entityType: 'Claim',
    entityId: 'claim_2',
    userId: 'cust_1',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_7',
    action: 'Policy Updated',
    entityType: 'Policy',
    entityId: 'pol_3',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'act_8',
    action: 'Customer Updated',
    entityType: 'Customer',
    entityId: 'cust_2',
    userId: 'admin_1',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];
