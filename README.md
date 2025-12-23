# Insurance Management System - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Complete Application Flows](#complete-application-flows)
6. [Database Schema](#database-schema)
7. [Security Implementation](#security-implementation)
8. [API Endpoints](#api-endpoints)

---

## Project Overview

### Purpose
The Insurance Management System is a full-stack web application designed to manage insurance policies, customers, and claims. It supports two user roles: **Admin** and **Customer**, each with distinct functionalities and access levels.

### Technology Stack

**Backend:**
- Spring Boot 3.4.12
- Java 21
- Spring Security with JWT authentication
- Spring Data JPA
- MySQL Database
- Maven for dependency management

**Frontend:**
- React 18.2.0
- React Router DOM for navigation
- Axios for HTTP requests
- Tailwind CSS for styling
- Vite as build tool
- React Toastify for notifications

### Key Features
- User authentication and authorization (JWT-based)
- Role-based access control (Admin/Customer)
- Customer management
- Policy management and assignment
- Claim submission and review
- Activity logging and audit trail
- Dashboard with statistics
- Pagination for all data tables
- Real-time notifications

---

## System Architecture

### High-Level Architecture

The system follows a **three-tier architecture**:

1. **Presentation Layer (Frontend)**: React-based single-page application
2. **Business Logic Layer (Backend)**: Spring Boot REST API
3. **Data Layer**: MySQL database

### Communication Flow

```
User Browser → React Frontend → REST API (Backend) → MySQL Database
                ↓
         JWT Token Authentication
                ↓
         Role-Based Authorization
```

---

## Backend Documentation

### Project Structure

The backend follows **MVC (Model-View-Controller)** architecture with clear separation of concerns:

```
insurance-backend/
├── src/main/java/com/capstone/insurance/
│   ├── InsuranceApplication.java (Main Entry Point)
│   ├── config/ (Configuration Classes)
│   ├── controllers/ (REST Controllers)
│   ├── services/ (Business Logic)
│   ├── repositories/ (Data Access Layer)
│   ├── entities/ (Database Models)
│   ├── dto/ (Data Transfer Objects)
│   ├── security/ (Security Configuration)
│   ├── exceptions/ (Error Handling)
│   └── util/ (Utility Classes)
└── src/main/resources/
    └── application.yml (Configuration File)
```

---

### Main Application Entry Point

#### InsuranceApplication.java

**Purpose**: This is the main Spring Boot application class that serves as the entry point for the entire backend application.

**Responsibilities**:
- Initializes the Spring Boot application context
- Configures the application to run on port 8080
- Contains a CommandLineRunner bean that executes on application startup
- Creates default admin and customer users if they don't exist
- Sets up initial database seeding with default credentials

**Initialization Process**:
1. On application startup, checks if admin user exists
2. Creates admin user with username "admin@exe.in" and password "Admin@123" if not present
3. Creates a default customer user with username "customer@exe.in" and password "Admin@123"
4. Creates corresponding customer record linked to the customer user
5. Hibernate automatically creates database tables based on entity definitions

**Key Features**:
- Uses PasswordEncoder to securely hash passwords before storage
- Generates UUIDs for customer records
- Sets timestamps (createdAt, updatedAt) for audit purposes
- Prints initialization messages to console

---

### Configuration Layer

#### SecurityConfig.java

**Purpose**: Configures Spring Security for the entire application, defining authentication and authorization rules.

**Key Configurations**:
- **Password Encoding**: Uses BCryptPasswordEncoder for secure password hashing
- **Security Filter Chain**: Defines which endpoints are public and which require authentication
- **Public Endpoints**: Login and refresh token endpoints are publicly accessible
- **Protected Endpoints**: All other endpoints require valid JWT token
- **CORS Configuration**: Allows cross-origin requests from frontend
- **Session Management**: Stateless session management (no server-side sessions)
- **Exception Handling**: Custom authentication entry point for unauthorized access

**Security Flow**:
1. Public requests (login) bypass authentication
2. Protected requests must include JWT token in Authorization header
3. JwtAuthenticationFilter validates token before allowing access
4. Role-based access control enforced using @PreAuthorize annotations

#### CorsConfig.java

**Purpose**: Configures Cross-Origin Resource Sharing (CORS) to allow frontend to communicate with backend.

**Configuration Details**:
- Allows requests from frontend origin (typically http://localhost:5173 for Vite)
- Permits common HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Allows necessary headers (Authorization, Content-Type)
- Enables credentials (cookies) for refresh token mechanism

---

### Controllers Layer (REST API Endpoints)

Controllers handle HTTP requests and responses, acting as the interface between frontend and backend services.

#### AuthController.java

**Purpose**: Manages user authentication, token generation, and session management.

**Endpoints**:
- **POST /api/auth/login**: Authenticates user credentials
  - Validates username and password
  - Generates JWT access token
  - Creates refresh token and stores in HTTP-only cookie
  - Returns user information and access token
  - Handles both username and email login (for customers)
  
- **POST /api/auth/refresh**: Refreshes access token
  - Validates refresh token from cookie or request body
  - Generates new access token
  - Returns updated token without requiring re-authentication
  
- **POST /api/auth/logout**: Logs out user
  - Invalidates refresh token
  - Clears refresh token cookie
  - Requires authentication

**Authentication Flow**:
1. User submits credentials
2. AuthenticationManager validates credentials
3. If valid, JwtTokenProvider generates access token
4. RefreshTokenService creates refresh token
5. Refresh token stored in HTTP-only cookie (secure)
6. Access token returned in response body
7. Frontend stores access token in localStorage

#### CustomerController.java

**Purpose**: Manages customer-related operations for admin users.

**Endpoints**:
- **GET /api/admin/customers?page={page}**: Retrieves paginated list of customers
  - Returns 10 customers per page
  - Sorted by creation date (newest first)
  - Includes pagination metadata
  
- **GET /api/admin/customers/{id}**: Retrieves specific customer by ID
  
- **POST /api/admin/customers**: Creates new customer
  - Generates unique customer code (CUS0001, CUS0002, etc.)
  - Creates associated user account
  - Generates unique username from customer name
  - Sets default password
  
- **PUT /api/admin/customers/{id}**: Updates customer information
  - Validates email uniqueness
  - Updates customer details

**Access Control**: All endpoints require ADMIN role

#### PolicyController.java

**Purpose**: Manages insurance policy operations.

**Endpoints**:
- **GET /api/admin/policies?page={page}**: Retrieves paginated policies
  - Returns 10 policies per page
  - Sorted by creation date (newest first)
  
- **GET /api/admin/policies/{id}**: Retrieves specific policy
  
- **POST /api/admin/policies**: Creates new policy
  - Auto-generates policy code (POL0001, POL0002, etc.)
  - Sets default status as ACTIVE
  
- **PUT /api/admin/policies/{id}**: Updates policy details
  
- **POST /api/admin/policies/customers/{customerId}/assign**: Assigns policy to customer
  - Validates policy and customer existence
  - Checks if policy already assigned
  - Generates unique policy number
  - Creates CustomerPolicy relationship

**Access Control**: All endpoints require ADMIN role

#### ClaimController.java

**Purpose**: Manages claim submission and review processes.

**Endpoints**:
- **POST /api/claims**: Customer submits new claim
  - Validates policy assignment to customer
  - Sets initial status as SUBMITTED
  - Logs claim submission activity
  
- **GET /api/claims/me**: Retrieves customer's own claims
  - Returns only claims belonging to authenticated customer
  - Sorted by creation date
  
- **GET /api/admin/claims?page={page}&status={status}&from={date}&to={date}**: Admin views all claims
  - Supports pagination (10 per page)
  - Optional filtering by status and date range
  
- **PUT /api/admin/claims/{id}/status**: Admin updates claim status
  - Changes status (APPROVED, REJECTED, IN_REVIEW)
  - Allows adding remarks
  - Logs status change activity

**Access Control**: 
- Customer endpoints require CUSTOMER role
- Admin endpoints require ADMIN role

#### ActivityLogController.java

**Purpose**: Manages system activity logs for audit purposes.

**Endpoints**:
- **GET /api/admin/activity-logs?page={page}**: Retrieves paginated activity logs
  - Returns 10 logs per page
  - Sorted by creation date (newest first)
  - Shows all system activities (claims, policy assignments, etc.)
  
- **POST /api/admin/activity-logs**: Creates manual activity log entry

**Access Control**: Requires ADMIN role

#### DashboardController.java

**Purpose**: Provides dashboard statistics for both admin and customer users.

**Endpoints**:
- **GET /api/admin/dashboard/stats**: Admin dashboard statistics
  - Total customers, policies, claims
  - Pending, approved, rejected claims count
  - Total coverage amounts
  - Monthly claims data
  - Policy type distribution
  
- **GET /api/customer/dashboard/stats**: Customer dashboard statistics
  - Customer's total policies
  - Customer's total claims
  - Policy status breakdown
  - Recent claims information

**Access Control**: Role-based (ADMIN or CUSTOMER)

---

### Services Layer (Business Logic)

Services contain the core business logic and orchestrate data operations between controllers and repositories.

#### CustomerService & CustomerServiceImpl.java

**Purpose**: Handles all customer-related business logic.

**Key Methods**:
- **createCustomer**: Creates new customer with auto-generated codes
  - Generates sequential customer code (CUS0001, CUS0002, etc.)
  - Creates unique username from customer name + random 5-digit number
  - Encrypts default password
  - Creates User entity and Customer entity
  - Links them together
  
- **getAllCustomersPaginated**: Retrieves customers with pagination
  - Uses Spring Data JPA Pageable
  - Returns 10 records per page
  - Sorted by creation date descending
  
- **getCustomerById**: Retrieves single customer by UUID
  
- **updateCustomer**: Updates customer information
  - Validates email uniqueness
  - Updates only allowed fields (name, email, phone, address)

**Business Rules**:
- Customer codes are sequential and unique
- Usernames must be unique across all users
- Email addresses must be unique per customer
- Default password is "Admin@123" for all new customers

#### PolicyService & PolicyServiceImpl.java

**Purpose**: Manages insurance policy business logic.

**Key Methods**:
- **createPolicy**: Creates new insurance policy
  - Auto-generates policy code (POL0001, POL0002, etc.)
  - Sets default status as ACTIVE
  - Stores coverage amount as BigDecimal for precision
  
- **getAllPoliciesPaginated**: Retrieves policies with pagination
  - Returns 10 policies per page
  - Sorted by creation date descending
  
- **assignPolicyToCustomer**: Assigns policy to customer
  - Validates customer and policy existence
  - Checks for duplicate assignments
  - Generates unique 10-character alphanumeric policy number
  - Creates CustomerPolicy relationship
  - Throws descriptive error if already assigned
  
- **getCustomerPolicies**: Retrieves all policies assigned to a customer
  - Used by customer dashboard
  - Returns policies with policy numbers

**Business Rules**:
- Policy codes are sequential and unique
- Policy numbers are randomly generated alphanumeric strings
- One policy can be assigned to multiple customers
- Each assignment gets unique policy number
- Coverage amounts use BigDecimal for decimal precision

#### ClaimService & ClaimServiceImpl.java

**Purpose**: Handles claim submission, retrieval, and status management.

**Key Methods**:
- **createClaim**: Customer submits new claim
  - Validates policy assignment to customer
  - Sets initial status as SUBMITTED
  - Generates claim number (CLM-2025-001 format)
  - Logs claim submission activity
  - Stores claim amount as BigDecimal
  
- **getMyClaims**: Retrieves customer's own claims
  - Filters by authenticated customer
  - Sorted by creation date descending
  
- **getAllClaimsPaginated**: Admin views all claims with filters
  - Supports pagination (10 per page)
  - Optional filtering by status
  - Optional date range filtering
  - Sorted by creation date descending
  
- **updateClaimStatus**: Admin updates claim status
  - Validates claim existence
  - Updates status (APPROVED, REJECTED, IN_REVIEW)
  - Allows adding remarks
  - Logs status change with old and new status
  - Includes remarks in activity log if provided

**Business Rules**:
- Claims can only be submitted for assigned policies
- Claim numbers follow format: CLM-{YEAR}-{ID}
- Status transitions are logged for audit
- Claim amounts use BigDecimal for precision

#### ActivityLogService & ActivityLogServiceImpl.java

**Purpose**: Manages system activity logging for audit trail.

**Key Methods**:
- **logAction**: Automatically logs system activities
  - Called by other services when actions occur
  - Records user ID, action type, and details
  - Timestamped automatically
  
- **getAllActivityLogsPaginated**: Retrieves activity logs
  - Returns 10 logs per page
  - Sorted by creation date descending (newest first)
  - Includes username for each log entry

**Activity Types Logged**:
- CLAIM_SUBMITTED: When customer submits claim
- CLAIM_STATUS_UPDATED: When admin changes claim status
- Policy assignments (future enhancement)

#### DashboardService & DashboardServiceImpl.java

**Purpose**: Aggregates and calculates dashboard statistics.

**Key Methods**:
- **getAdminDashboardStats**: Calculates admin dashboard metrics
  - Counts total customers, policies, claims
  - Calculates pending, approved, rejected claims
  - Sums total coverage amounts (using BigDecimal)
  - Sums total claim amounts
  - Calculates total approved claim amounts
  - Generates monthly claims data (last 6 months)
  - Calculates policy type distribution
  
- **getCustomerDashboardStats**: Calculates customer dashboard metrics
  - Counts customer's total policies
  - Counts customer's total claims
  - Breaks down claims by status
  - Provides recent claims information

**Calculations**:
- All monetary calculations use BigDecimal for precision
- Monthly data grouped by month
- Policy distribution grouped by policy type

#### RefreshTokenService & RefreshTokenServiceImpl.java

**Purpose**: Manages JWT refresh token lifecycle.

**Key Methods**:
- **createRefreshToken**: Creates new refresh token for user
  - Deletes existing refresh token for user
  - Generates new UUID-based token
  - Sets expiration (7 days default)
  - Links to user entity
  
- **verifyExpiration**: Validates refresh token expiration
  - Checks if token is expired
  - Deletes expired tokens
  - Throws exception if expired
  
- **findByToken**: Retrieves refresh token by token string
  - Used during token refresh process
  
- **deleteByUserId**: Removes all refresh tokens for user
  - Called during logout

**Token Management**:
- Refresh tokens stored in database
- Expiration set to 7 days (configurable)
- One active refresh token per user
- Old tokens deleted when new one created

---

### Repositories Layer (Data Access)

Repositories extend Spring Data JPA interfaces, providing database access methods.

#### UserRepository.java

**Purpose**: Data access for User entities.

**Key Methods**:
- **findByUsername**: Finds user by username
- **existsByUsername**: Checks username existence
- Standard JPA methods (save, findById, etc.)

#### CustomerRepository.java

**Purpose**: Data access for Customer entities.

**Key Methods**:
- **findByEmail**: Finds customer by email address
- **findByCustomerCode**: Finds customer by code
- **findByUserId**: Finds customer by associated user ID
- **findTopByOrderByCustomerCodeDesc**: Gets latest customer for code generation
- **findAll(Pageable)**: Paginated customer retrieval

#### PolicyRepository.java

**Purpose**: Data access for Policy entities.

**Key Methods**:
- **findByPolicyCode**: Finds policy by code
- **findByPolicyType**: Finds policies by type
- **findByStatus**: Finds policies by status
- **findTopByOrderByPolicyCodeDesc**: Gets latest policy for code generation
- **findAll(Pageable)**: Paginated policy retrieval

#### ClaimRepository.java

**Purpose**: Data access for Claim entities.

**Key Methods**:
- **findByCustomerId**: Finds claims for specific customer
- **findByStatus**: Finds claims by status
- **findByStatusAndCreatedAtBetween**: Finds claims by status and date range
- **findByCreatedAtBetween**: Finds claims in date range
- **findAll(Pageable)**: Paginated claim retrieval with filters

#### CustomerPolicyRepository.java

**Purpose**: Data access for CustomerPolicy (many-to-many relationship).

**Key Methods**:
- **existsByCustomerIdAndPolicyId**: Checks if policy assigned to customer
- **findByCustomerId**: Gets all policies for customer
- **findByCustomerIdAndPolicyId**: Gets specific assignment

#### ActivityLogRepository.java

**Purpose**: Data access for ActivityLog entities.

**Key Methods**:
- Standard JPA methods
- **findAll(Pageable)**: Paginated log retrieval

#### RefreshTokenRepository.java

**Purpose**: Data access for RefreshToken entities.

**Key Methods**:
- **findByToken**: Finds token by token string
- **findByUser**: Finds token by user
- **deleteByUser**: Removes tokens for user

---

### Entities Layer (Database Models)

Entities represent database tables and define the data structure.

#### User.java

**Purpose**: Represents user accounts in the system.

**Fields**:
- **id**: Primary key (Long)
- **username**: Unique username for login
- **password**: Encrypted password (BCrypt)
- **role**: User role (ADMIN or CUSTOMER) - Enum
- **enabled**: Account status (boolean)
- **createdAt**: Account creation timestamp
- **updatedAt**: Last update timestamp

**Relationships**:
- One-to-one with Customer (if role is CUSTOMER)

#### Customer.java

**Purpose**: Represents customer information.

**Fields**:
- **id**: Primary key (UUID)
- **customerCode**: Unique sequential code (CUS0001, etc.)
- **name**: Customer full name
- **email**: Unique email address
- **phone**: Contact phone number
- **address**: Customer address
- **user**: Reference to User entity
- **createdAt**: Record creation timestamp
- **updatedAt**: Last update timestamp

**Relationships**:
- One-to-one with User
- One-to-many with CustomerPolicy (policies assigned)

#### Policy.java

**Purpose**: Represents insurance policy templates.

**Fields**:
- **id**: Primary key (UUID)
- **policyCode**: Unique sequential code (POL0001, etc.)
- **policyType**: Type of policy (HEALTH, LIFE, AUTO, etc.) - Enum
- **coverageAmount**: Coverage amount (BigDecimal, precision 19, scale 2)
- **startDate**: Policy start date
- **endDate**: Policy end date
- **status**: Policy status (ACTIVE, INACTIVE, EXPIRED) - Enum
- **createdAt**: Record creation timestamp
- **updatedAt**: Last update timestamp

**Relationships**:
- One-to-many with CustomerPolicy (assignments to customers)

#### Claim.java

**Purpose**: Represents insurance claims submitted by customers.

**Fields**:
- **id**: Primary key (Long, auto-increment)
- **customer**: Reference to Customer entity
- **policy**: Reference to Policy entity
- **claimDate**: Date of incident
- **claimAmount**: Claim amount (BigDecimal, precision 19, scale 2)
- **status**: Claim status (SUBMITTED, IN_REVIEW, APPROVED, REJECTED) - Enum
- **description**: Claim description
- **remarks**: Admin remarks (for status updates)
- **evidenceUrl**: URL to evidence documents
- **createdAt**: Claim submission timestamp
- **updatedAt**: Last update timestamp

**Relationships**:
- Many-to-one with Customer
- Many-to-one with Policy

#### CustomerPolicy.java

**Purpose**: Represents the many-to-many relationship between customers and policies (assignments).

**Fields**:
- **id**: Primary key (Long)
- **customer**: Reference to Customer entity
- **policy**: Reference to Policy entity
- **policyNumber**: Unique policy number for this assignment (alphanumeric)
- **createdAt**: Assignment timestamp
- **updatedAt**: Last update timestamp

**Purpose**: 
- Links customers to their assigned policies
- Each assignment has unique policy number
- Tracks when policy was assigned

#### ActivityLog.java

**Purpose**: Represents system activity logs for audit trail.

**Fields**:
- **id**: Primary key (Long)
- **user**: Reference to User who performed action
- **actionType**: Type of action (CLAIM_SUBMITTED, etc.)
- **details**: Detailed description of action
- **createdAt**: Action timestamp
- **updatedAt**: Last update timestamp

**Purpose**:
- Tracks all system activities
- Provides audit trail
- Links actions to users

#### RefreshToken.java

**Purpose**: Represents JWT refresh tokens for token renewal.

**Fields**:
- **id**: Primary key (Long)
- **user**: Reference to User entity
- **token**: Unique token string (UUID)
- **expiryDate**: Token expiration timestamp
- **createdAt**: Token creation timestamp

**Purpose**:
- Enables access token refresh without re-login
- Stored in database for validation
- Expires after configured duration (7 days)

#### Enums

**Role.java**: Defines user roles (ADMIN, CUSTOMER)

**PolicyType.java**: Defines policy types (HEALTH, LIFE, AUTO, etc.)

**PolicyStatus.java**: Defines policy statuses (ACTIVE, INACTIVE, EXPIRED)

**ClaimStatus.java**: Defines claim statuses (SUBMITTED, IN_REVIEW, APPROVED, REJECTED)

---

### DTOs Layer (Data Transfer Objects)

DTOs are used to transfer data between layers without exposing entity details.

#### Common DTOs

**PaginatedResponse.java**: Generic pagination wrapper
- **content**: List of items for current page
- **currentPage**: Current page number (0-indexed)
- **pageSize**: Number of items per page (10)
- **totalElements**: Total number of items
- **totalPages**: Total number of pages
- **hasNext**: Whether next page exists
- **hasPrevious**: Whether previous page exists

#### Auth DTOs

**LoginRequest.java**: Login credentials
- **username**: Username or email
- **password**: User password

**AuthResponse.java**: Authentication response
- **token**: JWT access token
- **username**: Authenticated username
- **role**: User role
- **userId**: User ID

**RefreshTokenRequest.java**: Refresh token request
- **refreshToken**: Refresh token string

#### Customer DTOs

**CustomerDto.java**: Customer data for responses
- All customer fields (id, code, name, email, phone, address, username)
- Includes timestamps

**CustomerCreateRequest.java**: Customer creation data
- **name**: Customer name
- **email**: Email address
- **phone**: Phone number
- **address**: Address

**CustomerUpdateRequest.java**: Customer update data
- Same fields as create request

#### Policy DTOs

**PolicyDto.java**: Policy data for responses
- All policy fields including coverage amount (BigDecimal)

**PolicyCreateRequest.java**: Policy creation data
- **policyType**: Type of policy
- **coverageAmount**: Coverage amount (BigDecimal)
- **startDate**: Start date
- **endDate**: End date

**PolicyUpdateRequest.java**: Policy update data
- Same as create plus status field

**AssignPolicyRequest.java**: Policy assignment data
- **policyId**: Policy to assign

**CustomerPolicyDto.java**: Customer's assigned policy data
- Policy details plus policy number from assignment

#### Claim DTOs

**ClaimDto.java**: Claim data for responses
- All claim fields including claim number, policy number
- Claim amount as BigDecimal

**ClaimCreateRequest.java**: Claim submission data
- **policyId**: Policy for claim
- **claimDate**: Date of incident
- **claimAmount**: Claim amount (BigDecimal)
- **description**: Claim description
- **evidenceUrl**: Evidence document URL

**ClaimStatusUpdateRequest.java**: Claim status update data
- **status**: New status
- **remarks**: Admin remarks

#### Activity DTOs

**ActivityLogDto.java**: Activity log data
- **id**: Log ID
- **userId**: User who performed action
- **username**: Username for display
- **actionType**: Type of action
- **details**: Action details
- **createdAt**: Timestamp

**ActivityLogCreateRequest.java**: Manual log creation
- **userId**: User ID
- **actionType**: Action type
- **details**: Action details

#### Dashboard DTOs

**AdminDashboardStatsDto.java**: Admin dashboard statistics
- Counts (customers, policies, claims, pending, approved, rejected)
- Amounts (total coverage, total claims, approved claims) as BigDecimal
- Monthly claims data
- Policy type distribution

**CustomerDashboardStatsDto.java**: Customer dashboard statistics
- Customer's policy count
- Customer's claim count
- Claims by status
- Recent claims

**MonthlyClaimData.java**: Monthly claim statistics
- **month**: Month name
- **count**: Number of claims
- **amount**: Total amount (BigDecimal)

**PolicyTypeDistribution.java**: Policy type statistics
- **policyType**: Policy type
- **count**: Number of policies

---

### Security Layer

#### JwtTokenProvider.java

**Purpose**: Handles JWT token generation and validation.

**Key Methods**:
- **generateToken**: Creates JWT access token
  - Includes username, role, userId in claims
  - Sets expiration (1 hour default)
  - Signs with secret key
  
- **validateToken**: Validates JWT token
  - Checks signature
  - Verifies expiration
  - Returns boolean
  
- **getUsernameFromToken**: Extracts username from token
- **getUserIdFromToken**: Extracts user ID from token
- **getRoleFromToken**: Extracts role from token

**Token Structure**:
- Header: Algorithm and type
- Payload: User claims (username, role, userId, expiration)
- Signature: HMAC SHA256 with secret key

#### JwtAuthenticationFilter.java

**Purpose**: Intercepts requests to validate JWT tokens.

**Process**:
1. Intercepts all requests except public endpoints
2. Extracts token from Authorization header
3. Validates token using JwtTokenProvider
4. Loads user details from token
5. Sets authentication in SecurityContext
6. Allows request to proceed if valid
7. Returns 401 if token invalid or missing

**Filter Chain Position**: Executes before controller methods

#### CustomUserDetailsService.java

**Purpose**: Loads user details for Spring Security.

**Key Methods**:
- **loadUserByUsername**: Loads user by username
  - Queries UserRepository
  - Creates UserPrincipal with authorities
  - Returns user details for authentication

**Purpose**: Integrates custom user model with Spring Security

#### UserPrincipal.java

**Purpose**: Wraps User entity for Spring Security.

**Fields**:
- User entity reference
- Authorities based on role

**Purpose**: Provides Spring Security-compatible user representation

---

### Exceptions Layer

#### GlobalExceptionHandler.java

**Purpose**: Centralized exception handling for all controllers.

**Handled Exceptions**:
- **ResourceNotFoundException**: Returns 404 with error message
- **BadRequestException**: Returns 400 with error message
- **BadCredentialsException**: Returns 401 with error message
- **MethodArgumentNotValidException**: Returns 400 with validation errors
- **Exception**: Generic handler returns 500

**Response Format**:
- **timestamp**: Error timestamp
- **status**: HTTP status code
- **error**: Error type
- **message**: Error message
- **path**: Request path

#### Custom Exceptions

**ResourceNotFoundException.java**: Thrown when resource not found
**BadRequestException.java**: Thrown for invalid requests

**ApiError.java**: Standard error response structure

---

### Application Configuration

#### application.yml

**Purpose**: Central configuration file for Spring Boot application.

**Sections**:
- **server.port**: Application port (8080)
- **spring.datasource**: MySQL database connection
  - URL: Database connection string
  - Username: Database username
  - Password: Database password
- **spring.jpa**: JPA/Hibernate configuration
  - **ddl-auto**: update (auto-create/update tables)
  - **show-sql**: true (log SQL queries)
  - **format_sql**: true (format SQL output)
- **logging.level**: Logging configuration
- **app.jwt**: JWT configuration
  - **secret**: Secret key for token signing
  - **expiration-ms**: Access token expiration (1 hour)
  - **refresh-expiration-ms**: Refresh token expiration (7 days)

---

## Frontend Documentation

### Project Structure

The frontend follows **component-based architecture** with clear separation:

```
src/
├── main.jsx (Application Entry Point)
├── App.jsx (Main Application Component)
├── pages/ (Page Components)
├── components/ (Reusable Components)
├── services/ (API Communication)
├── context/ (State Management)
├── utils/ (Utility Functions)
├── styles/ (Styling Files)
└── hooks/ (Custom React Hooks)
```

---

### Application Entry Points

#### main.jsx

**Purpose**: React application entry point that renders the root component.

**Responsibilities**:
- Imports React and ReactDOM
- Imports main App component
- Imports global styles
- Creates root element
- Renders App component in React.StrictMode
- Mounts application to DOM element with id "root"

**Execution Flow**:
1. Application starts
2. ReactDOM creates root
3. Renders App component
4. App initializes routing and authentication

#### App.jsx

**Purpose**: Main application component that sets up routing, authentication context, and layout structure.

**Key Responsibilities**:
- Wraps application with AuthProvider for global authentication state
- Sets up React Router for navigation
- Defines route structure for customer and admin sections
- Creates layout components (CustomerLayout, AdminLayout)
- Configures toast notifications
- Handles route protection and redirection

**Layout Components**:
- **CustomerLayout**: Layout for customer pages
  - Includes Navbar and Sidebar
  - Sidebar with customer menu items
  - Responsive sidebar toggle
  - Main content area with proper spacing
  
- **AdminLayout**: Layout for admin pages
  - Includes Navbar and Sidebar
  - Sidebar with admin menu items
  - Same responsive behavior

**Route Structure**:
- **/login**: Login page (public)
- **/customer/***: Customer routes (protected)
  - /customer/dashboard
  - /customer/policies
  - /customer/claims
  - /customer/claims/new
- **/admin/***: Admin routes (protected)
  - /admin/dashboard
  - /admin/customers
  - /admin/policies
  - /admin/claims
  - /admin/activity
- **/**: Root redirects based on authentication

**Features**:
- Automatic redirection based on authentication status
- Role-based route protection
- Toast notification container
- Responsive sidebar with toggle functionality

---

### Pages Layer

Pages are top-level components that represent different views in the application.

#### Login.jsx

**Purpose**: Login page component that renders the login form.

**Responsibilities**:
- Displays login interface
- Renders LoginForm component
- Provides page-level styling and layout
- Handles page-level state if needed

#### Customer Pages

##### CustomerDashboard.jsx

**Purpose**: Customer's main dashboard showing their insurance overview.

**Key Features**:
- Displays customer statistics
  - Total policies count
  - Total claims count
  - Claims by status breakdown
- Shows recent claims
- Displays policy summary cards
- Fetches data from dashboard service
- Shows loading state during data fetch
- Displays error messages if fetch fails

**Data Flow**:
1. Component mounts
2. Calls dashboardService.getCustomerDashboardStats()
3. Displays loading spinner
4. Renders statistics on success
5. Shows error message on failure

##### MyPolicies.jsx

**Purpose**: Displays all policies assigned to the logged-in customer.

**Key Features**:
- Lists all customer's policies
- Shows policy details (code, type, coverage, dates, status)
- Displays policy numbers
- Shows status badges
- Allows viewing policy details in modal
- Sorted by creation date (newest first)

**Components Used**:
- PolicyList component for table display
- PolicyDetailsModal for detailed view

##### MyClaims.jsx

**Purpose**: Displays all claims submitted by the logged-in customer.

**Key Features**:
- Lists customer's claims
- Shows claim details (number, date, amount, status)
- Displays status badges with color coding
- Allows viewing claim details in modal
- Shows claim submission date
- Sorted by creation date (newest first)

**Components Used**:
- ClaimList component for table display
- ClaimDetailsModal for detailed view

##### RaiseClaim.jsx

**Purpose**: Form for customers to submit new insurance claims.

**Key Features**:
- Form with validation
- Policy selection dropdown (shows assigned policies)
- Date picker for incident date
- Amount input with decimal support
- Description textarea
- Evidence URL input (optional)
- Form validation before submission
- Success/error toast notifications
- Redirects to claims list after successful submission

**Form Fields**:
- Policy selection (required)
- Claim date (required)
- Claim amount (required, decimal)
- Description (required)
- Evidence URL (optional)

**Validation**:
- All required fields must be filled
- Amount must be positive number
- Date must be valid

#### Admin Pages

##### AdminDashboard.jsx

**Purpose**: Admin's main dashboard showing system-wide statistics.

**Key Features**:
- Displays comprehensive statistics
  - Total customers, policies, claims
  - Pending, approved, rejected claims
  - Total coverage amounts
  - Total claim amounts
  - Approved claim amounts
- Shows charts and graphs
  - Monthly claims trend
  - Policy type distribution
- Real-time data updates
- Loading states
- Error handling

**Data Visualization**:
- Uses Recharts library for charts
- Monthly claims line/bar chart
- Policy type pie chart
- Statistics cards with icons

##### CustomersManagement.jsx

**Purpose**: Admin interface for managing customers.

**Key Features**:
- Displays paginated customer list (10 per page)
- Search functionality (client-side filtering)
- Create new customer
- Edit existing customer
- View customer details
- Table with customer information
- Pagination controls
- Loading state in table area only
- Success/error notifications

**Operations**:
- **Create**: Opens modal with customer form
  - Auto-generates customer code
  - Creates user account
  - Sets default password
- **Edit**: Opens modal with pre-filled form
  - Updates customer information
  - Validates email uniqueness
- **View**: Opens details modal
  - Shows all customer information
  - Displays associated username

**State Management**:
- Manages customer list state
- Manages pagination state (current page)
- Manages modal visibility
- Manages form data
- Manages loading state

##### PoliciesManagement.jsx

**Purpose**: Admin interface for managing insurance policies.

**Key Features**:
- Displays paginated policy list (10 per page)
- Search functionality
- Advanced filters (type, status)
- Create new policy
- Edit existing policy
- View policy details
- Assign policy to customer
- Table with policy information
- Pagination controls
- Loading state in table area

**Operations**:
- **Create**: Opens modal with policy form
  - Auto-generates policy code
  - Sets default status as ACTIVE
  - Stores coverage amount as BigDecimal
- **Edit**: Opens modal with pre-filled form
  - Updates policy details
  - Can change status
- **Assign**: Opens modal to assign policy to customer
  - Customer selection dropdown
  - Validates assignment
  - Generates unique policy number
  - Shows error if already assigned
- **View**: Opens details modal

**State Management**:
- Manages policy list state
- Manages customer list (for assignment)
- Manages pagination state
- Manages filter state
- Manages modal visibility

##### ClaimsReview.jsx

**Purpose**: Admin interface for reviewing and managing claims.

**Key Features**:
- Displays paginated claim list (10 per page)
- Search functionality
- Advanced filters (status, date range, amount range)
- View claim details
- Update claim status
- Add remarks to claims
- Table with claim information
- Pagination controls
- Loading state in table area

**Operations**:
- **View**: Opens details modal
  - Shows complete claim information
  - Displays customer and policy details
- **Update Status**: Opens modal
  - Status selection dropdown
  - Remarks textarea
  - Updates claim status
  - Logs status change activity
  - Shows success/error notifications

**Status Options**:
- SUBMITTED (initial status)
- IN_REVIEW (under review)
- APPROVED (approved claim)
- REJECTED (rejected claim)

**State Management**:
- Manages claim list state
- Manages pagination state
- Manages filter state
- Manages modal visibility
- Manages status update form

##### ActivityLog.jsx

**Purpose**: Admin interface for viewing system activity logs.

**Key Features**:
- Displays paginated activity log list (10 per page)
- Search functionality (client-side filtering by action type, username, details)
- Advanced filters (action type, date range)
- Table with activity information
- Pagination controls
- Loading state in table area
- Shows all system activities chronologically

**Displayed Information**:
- Action type (CLAIM_SUBMITTED, CLAIM_STATUS_UPDATED, etc.)
- Username who performed action
- Detailed action description
- Timestamp of action
- Sorted by creation date (newest first)

**State Management**:
- Manages activity log list state
- Manages pagination state
- Manages filter state
- Manages search query
- Manages loading state

**Data Flow**:
1. Component mounts
2. Fetches first page of activity logs
3. Displays logs in table
4. User can navigate pages or apply filters
5. Client-side search filters displayed logs

---

### Components Layer

Components are reusable UI elements used across different pages.

#### Common Components

##### Alert.jsx

**Purpose**: Displays alert messages (success, error, warning, info) to users.

**Features**:
- Multiple alert types with color coding
- Dismissible alerts with close button
- Auto-dismiss after timeout (optional)
- Icon indicators for each type
- Smooth animations

**Usage**: Used throughout application for displaying messages

##### Button.jsx

**Purpose**: Reusable button component with multiple variants and sizes.

**Variants**:
- **default**: Primary action button (purple theme)
- **outline**: Secondary button with border
- **danger**: Destructive action button (red theme)
- **ghost**: Minimal button without background

**Sizes**:
- **sm**: Small button
- **md**: Medium button (default)
- **lg**: Large button

**Features**:
- Loading state with spinner
- Disabled state
- Icon support
- Click handlers

##### Card.jsx

**Purpose**: Container component for grouping related content.

**Features**:
- Card container with shadow
- Card header section
- Card content section
- Optional footer
- Consistent styling

##### Input.jsx

**Purpose**: Reusable input field component.

**Features**:
- Text, number, email, password input types
- Label support
- Placeholder text
- Error message display
- Required field indicator
- Disabled state
- Validation styling

##### Select.jsx

**Purpose**: Dropdown select component.

**Features**:
- Options list
- Label support
- Placeholder text
- Required field indicator
- Disabled state
- Error message display

##### Modal.jsx

**Purpose**: Modal dialog component for overlays.

**Features**:
- Overlay background
- Centered modal content
- Title section
- Close button
- Click outside to close (optional)
- Prevents body scroll when open
- Smooth open/close animations

##### Table.jsx

**Purpose**: Reusable table component for displaying tabular data.

**Features**:
- Configurable columns
- Custom cell rendering
- Row click handlers
- Loading state display
- Empty state message
- Responsive design
- Styled header row
- Hover effects on rows

**Column Configuration**:
- Column key (data field)
- Column label (header text)
- Custom render function
- Column styling

##### LoadingSpinner.jsx

**Purpose**: Loading indicator component.

**Features**:
- Animated spinner
- Multiple sizes (sm, md, lg)
- Centered display
- Purple theme color

##### Pagination.jsx

**Purpose**: Pagination controls for navigating through pages.

**Features**:
- Previous/Next buttons
- Page number buttons
- Ellipsis for large page counts
- Shows "Showing X to Y of Z results"
- Responsive design (mobile and desktop)
- Always visible (even with less than 10 records)
- Disabled states for first/last page

**Display Logic**:
- Shows up to 5 page numbers
- Ellipsis for skipped pages
- Always shows first and last page
- Highlights current page

##### SearchInput.jsx

**Purpose**: Search input field with icon.

**Features**:
- Search icon
- Placeholder text
- Real-time input handling
- Clear button
- Styled input field

##### AdvancedFilter.jsx

**Purpose**: Advanced filtering component with multiple filter types.

**Features**:
- Multiple filter types (select, date, number)
- Dynamic filter options
- Reset filters button
- Filter state management
- Collapsible filter panel

**Filter Types**:
- **Select**: Dropdown selection
- **Date**: Date picker
- **Number**: Numeric input

##### StatusBadge.jsx

**Purpose**: Displays status with color-coded badges.

**Features**:
- Color coding by status
- Rounded badge design
- Text labels
- Status mapping (ACTIVE, INACTIVE, SUBMITTED, etc.)

##### ProtectedRoute.jsx

**Purpose**: Route protection component that checks authentication and authorization.

**Features**:
- Checks if user is authenticated
- Validates user role against allowed roles
- Redirects to login if not authenticated
- Redirects to appropriate dashboard if wrong role
- Renders children only if authorized

**Usage**: Wraps protected routes in App.jsx

##### Navbar.jsx

**Purpose**: Top navigation bar component.

**Features**:
- User information display
- Logout button
- Role-based display
- Responsive design
- Fixed position at top

##### Sidebar.jsx

**Purpose**: Side navigation menu component.

**Features**:
- Collapsible sidebar
- Menu items with icons
- Active route highlighting
- Smooth toggle animation
- Responsive behavior
- Role-based menu items

**Menu Structure**:
- Grouped menu items
- Section titles
- Navigation links
- Icon support

#### Customer Components

##### CustomerList.jsx

**Purpose**: Displays list of customers in table format.

**Features**:
- Table with customer columns
- View and Edit action buttons
- Row click to view details
- Loading state support
- Formatted phone numbers
- Customer code display

**Columns**:
- Customer Code
- Name
- Email
- Phone (formatted)
- Address
- Username
- Actions (View, Edit)

##### CustomerForm.jsx

**Purpose**: Form component for creating and editing customers.

**Features**:
- Form fields (name, email, phone, address)
- Validation
- Submit and cancel buttons
- Loading state during submission
- Pre-filled data for edit mode
- Error message display

##### CustomerDetailsModal.jsx

**Purpose**: Modal displaying detailed customer information.

**Features**:
- Shows all customer fields
- Displays associated username
- Read-only view
- Close button
- Formatted data display

##### CustomerCard.jsx

**Purpose**: Card component displaying customer summary.

**Features**:
- Customer name and code
- Contact information
- Quick view of details
- Click to view full details

#### Policy Components

##### PolicyList.jsx

**Purpose**: Displays list of policies in table format.

**Features**:
- Table with policy columns
- View, Edit, Assign action buttons
- Status badges
- Formatted currency amounts
- Formatted dates
- Loading state support
- Row click to view details

**Columns**:
- Policy Code
- Policy Type
- Coverage Amount (formatted)
- Start Date
- End Date
- Status (with badge)
- Actions (View, Edit, Assign)

##### PolicyForm.jsx

**Purpose**: Form component for creating and editing policies.

**Features**:
- Policy type selection
- Coverage amount input (decimal support)
- Date pickers for start and end dates
- Status selection (for edit mode)
- Validation
- Submit and cancel buttons
- Loading state
- Pre-filled data for edit mode

##### PolicyDetailsModal.jsx

**Purpose**: Modal displaying detailed policy information.

**Features**:
- Shows all policy fields
- Formatted amounts
- Formatted dates
- Status display
- Read-only view

##### PolicyCard.jsx

**Purpose**: Card component displaying policy summary.

**Features**:
- Policy code and type
- Coverage amount
- Status badge
- Quick view

##### PolicySearch.jsx

**Purpose**: Search component for filtering policies.

**Features**:
- Search input
- Filter options
- Real-time filtering

#### Claim Components

##### ClaimList.jsx

**Purpose**: Displays list of claims in table format.

**Features**:
- Table with claim columns
- View and Update action buttons
- Status badges with colors
- Formatted currency amounts
- Formatted dates
- Loading state support
- Row click to view details
- Optional policy number column

**Columns**:
- Claim Number
- Policy Number (optional)
- Claim Date
- Amount (formatted)
- Status (with badge)
- Submitted Date
- Actions (View, Update)

##### ClaimForm.jsx

**Purpose**: Form component for submitting new claims.

**Features**:
- Policy selection dropdown
- Date picker for claim date
- Amount input (decimal support)
- Description textarea
- Evidence URL input (optional)
- Validation
- Submit and cancel buttons
- Loading state
- Fetches customer's assigned policies

##### ClaimDetailsModal.jsx

**Purpose**: Modal displaying detailed claim information.

**Features**:
- Shows all claim fields
- Customer information
- Policy information
- Status display
- Remarks display
- Formatted amounts and dates
- Read-only view

##### ClaimCard.jsx

**Purpose**: Card component displaying claim summary.

**Features**:
- Claim number
- Amount
- Status badge
- Date information
- Quick view

##### ClaimStatusBadge.jsx

**Purpose**: Status badge specifically for claims.

**Features**:
- Color coding by claim status
- Status text display
- Consistent styling

##### ClaimFilter.jsx

**Purpose**: Filter component for claims.

**Features**:
- Status filter
- Date range filter
- Amount range filter
- Reset filters

---

### Services Layer

Services handle all API communication with the backend.

#### api.js

**Purpose**: Axios instance configuration and interceptors for API requests.

**Key Features**:
- Base URL configuration
- Request interceptor: Adds JWT token to Authorization header
- Response interceptor: Handles token refresh on 401 errors
- Skips token refresh for auth endpoints (login, refresh, logout)
- Automatic token refresh mechanism
- Error handling
- Credentials support for cookies

**Token Refresh Flow**:
1. Request fails with 401
2. Checks if it's an auth endpoint (skip refresh)
3. Attempts to refresh token using refresh token cookie
4. Retries original request with new token
5. Redirects to login if refresh fails

**Configuration**:
- Base URL from environment variable or default
- Content-Type: application/json
- withCredentials: true (for cookies)

#### authService.js

**Purpose**: Authentication-related API calls.

**Methods**:
- **login**: Authenticates user and stores token
  - Sends credentials to backend
  - Stores JWT token in localStorage
  - Stores user information in localStorage
  - Returns user data and token
  - Handles errors with proper messages
  
- **logout**: Logs out user
  - Calls logout endpoint
  - Clears localStorage
  - Removes tokens
  
- **getCurrentUser**: Retrieves current user from localStorage
- **getToken**: Retrieves token from localStorage
- **isAuthenticated**: Checks if user is authenticated
- **getMe**: Decodes JWT token to get user info

**Error Handling**:
- Extracts error messages from API responses
- Filters out refresh token errors for login
- Provides user-friendly error messages

#### customerService.js

**Purpose**: Customer-related API calls.

**Methods**:
- **getAllCustomers**: Fetches paginated customer list
  - Accepts page parameter (default 0)
  - Returns paginated response
  
- **getCustomerById**: Fetches single customer by ID
- **createCustomer**: Creates new customer
- **updateCustomer**: Updates customer information
- **deleteCustomer**: Deletes customer (if implemented)

**Error Handling**: Extracts and throws error messages

#### policyService.js

**Purpose**: Policy-related API calls.

**Methods**:
- **getAllPolicies**: Fetches paginated policy list
  - Accepts page parameter
  
- **getPolicyById**: Fetches single policy
- **createPolicy**: Creates new policy
- **updatePolicy**: Updates policy
- **assignPolicyToCustomer**: Assigns policy to customer
  - Proper error handling for duplicate assignments
  - Extracts backend error messages
  
- **getMyPolicies**: Fetches customer's assigned policies

#### claimService.js

**Purpose**: Claim-related API calls.

**Methods**:
- **createClaim**: Submits new claim
- **getMyClaims**: Fetches customer's claims
- **getAllClaims**: Fetches paginated claims with filters
  - Accepts filters object (status, from, to dates)
  - Accepts page parameter
  
- **updateClaimStatus**: Updates claim status (admin only)

**Filter Support**:
- Status filter
- Date range filter (from, to)
- Pagination

#### activityService.js

**Purpose**: Activity log API calls.

**Methods**:
- **getActivityLogs**: Fetches paginated activity logs
  - Accepts page parameter
  
- **createActivityLog**: Creates manual log entry
- **getActivityLogsByType**: Filters logs by type

#### dashboardService.js

**Purpose**: Dashboard statistics API calls.

**Methods**:
- **getAdminDashboardStats**: Fetches admin dashboard statistics
- **getCustomerDashboardStats**: Fetches customer dashboard statistics

#### userService.js

**Purpose**: User-related API calls (if implemented).

---

### Context Layer

#### AuthContext.jsx

**Purpose**: Global authentication state management using React Context.

**Features**:
- Provides authentication state to entire application
- User information
- Authentication status
- Login function
- Logout function
- Token management
- Auto-initialization from localStorage

**State Provided**:
- **user**: Current user object (id, username, role)
- **isAuthenticated**: Boolean authentication status
- **loading**: Loading state during auth operations

**Methods**:
- **login**: Authenticates user and updates state
- **logout**: Clears authentication state
- **isAuthenticated**: Helper function to check auth status

**Initialization**:
- Checks localStorage on mount
- Restores user session if token exists
- Validates token before restoring

---

### Utils Layer

Utility functions used throughout the application.

#### formatters.js

**Purpose**: Data formatting functions.

**Functions**:
- **formatCurrency**: Formats numbers as currency (₹ symbol)
- **formatDate**: Formats dates to readable format
- **formatDateTime**: Formats date-time to readable format
- **formatPhone**: Formats phone numbers

#### constants.js

**Purpose**: Application-wide constants.

**Constants**:
- **CLAIM_STATUS**: Claim status enum values
- **API_ENDPOINTS**: Centralized API endpoint definitions
- Other application constants

#### validators.js

**Purpose**: Validation functions.

**Functions**:
- Email validation
- Phone validation
- Required field validation
- Number validation

#### helpers.js

**Purpose**: Helper utility functions.

**Functions**:
- Common helper functions
- Data transformation
- Utility methods

#### storage.js

**Purpose**: LocalStorage management utilities.

**Functions**:
- Save to localStorage
- Retrieve from localStorage
- Remove from localStorage
- Clear all storage

#### dataMapper.js

**Purpose**: Data transformation and mapping functions.

**Functions**:
- Maps API responses to component data
- Transforms data formats
- Data normalization

---

### Styles Layer

#### index.css

**Purpose**: Global styles and Tailwind CSS imports.

**Features**:
- Tailwind directives
- Global CSS variables
- Base styles
- Reset styles

#### variables.css

**Purpose**: CSS custom properties (variables).

**Variables**:
- Color palette
- Spacing values
- Font sizes
- Border radius
- Shadows

#### components.css

**Purpose**: Component-specific styles.

**Styles**:
- Badge styles
- Button styles
- Modal styles
- Alert styles
- Loading spinner styles

#### pages.css

**Purpose**: Page-specific styles.

**Styles**:
- Dashboard layouts
- Page containers
- Section styles

---

### Hooks Layer

#### useLocalStorage.js

**Purpose**: Custom React hook for localStorage management.

**Features**:
- Syncs state with localStorage
- Handles JSON serialization
- Provides getter and setter
- Handles errors gracefully

---

## Complete Application Flows

### Authentication Flow

**Login Process**:
1. User enters credentials on login page
2. Frontend sends POST request to /api/auth/login
3. Backend validates credentials using AuthenticationManager
4. If valid, backend generates JWT access token
5. Backend creates refresh token and stores in HTTP-only cookie
6. Backend returns access token and user information
7. Frontend stores access token in localStorage
8. Frontend stores user information in localStorage
9. Frontend updates AuthContext with user data
10. Frontend redirects to appropriate dashboard based on role

**Token Refresh Process**:
1. API request fails with 401 (token expired)
2. Frontend interceptor checks if it's an auth endpoint (skip if yes)
3. Frontend sends refresh request with refresh token cookie
4. Backend validates refresh token
5. Backend generates new access token
6. Frontend stores new token
7. Frontend retries original request with new token

**Logout Process**:
1. User clicks logout
2. Frontend calls logout API endpoint
3. Backend invalidates refresh token
4. Backend clears refresh token cookie
5. Frontend clears localStorage
6. Frontend clears AuthContext
7. Frontend redirects to login page

### Customer Management Flow

**Create Customer**:
1. Admin clicks "Add Customer" button
2. Modal opens with customer form
3. Admin fills form (name, email, phone, address)
4. Admin submits form
5. Frontend sends POST request to /api/admin/customers
6. Backend generates customer code (CUS0001, etc.)
7. Backend generates unique username
8. Backend creates User entity with encrypted password
9. Backend creates Customer entity
10. Backend links User and Customer
11. Backend returns created customer
12. Frontend refreshes customer list
13. Frontend shows success notification
14. Modal closes

**Edit Customer**:
1. Admin clicks edit button on customer row
2. Modal opens with pre-filled form
3. Admin modifies fields
4. Admin submits form
5. Frontend sends PUT request to /api/admin/customers/{id}
6. Backend validates email uniqueness
7. Backend updates customer
8. Backend returns updated customer
9. Frontend refreshes customer list
10. Frontend shows success notification

**View Customer**:
1. Admin clicks view button or row
2. Details modal opens
3. Frontend displays all customer information
4. Read-only view

### Policy Management Flow

**Create Policy**:
1. Admin clicks "Create Policy" button
2. Modal opens with policy form
3. Admin selects policy type
4. Admin enters coverage amount (decimal supported)
5. Admin sets start and end dates
6. Admin submits form
7. Frontend sends POST request to /api/admin/policies
8. Backend generates policy code (POL0001, etc.)
9. Backend creates Policy entity
10. Backend sets status as ACTIVE
11. Backend returns created policy
12. Frontend refreshes policy list
13. Frontend shows success notification

**Assign Policy to Customer**:
1. Admin clicks "Assign" button on policy
2. Assignment modal opens
3. Admin selects customer from dropdown
4. Admin clicks "Assign" button
5. Frontend sends POST request to /api/admin/policies/customers/{customerId}/assign
6. Backend validates customer and policy exist
7. Backend checks if already assigned
8. If already assigned, backend returns error with descriptive message
9. If not assigned, backend generates unique policy number
10. Backend creates CustomerPolicy relationship
11. Backend returns success
12. Frontend shows success notification
13. Frontend refreshes policy list

### Claim Submission Flow

**Customer Submits Claim**:
1. Customer navigates to "Raise Claim" page
2. Customer selects policy from dropdown (shows assigned policies)
3. Customer enters claim date
4. Customer enters claim amount (decimal supported)
5. Customer enters description
6. Customer optionally enters evidence URL
7. Customer submits form
8. Frontend sends POST request to /api/claims
9. Backend validates policy is assigned to customer
10. Backend creates Claim entity with status SUBMITTED
11. Backend generates claim number (CLM-2025-001)
12. Backend logs claim submission activity
13. Backend returns created claim
14. Frontend shows success notification
15. Frontend redirects to claims list

**Admin Reviews Claim**:
1. Admin navigates to Claims Review page
2. Admin views paginated claim list
3. Admin can filter by status, date range
4. Admin clicks "Update" button on claim
5. Modal opens with status selection and remarks field
6. Admin selects new status (APPROVED, REJECTED, IN_REVIEW)
7. Admin optionally adds remarks
8. Admin submits
9. Frontend sends PUT request to /api/admin/claims/{id}/status
10. Backend validates claim exists
11. Backend updates claim status
12. Backend logs status change activity with old and new status
13. Backend returns updated claim
14. Frontend refreshes claim list
15. Frontend shows success notification

### Dashboard Flow

**Admin Dashboard**:
1. Admin navigates to dashboard
2. Frontend calls /api/admin/dashboard/stats
3. Backend calculates statistics:
   - Counts customers, policies, claims
   - Calculates claim status breakdowns
   - Sums coverage and claim amounts (BigDecimal)
   - Groups monthly claims data
   - Calculates policy type distribution
4. Backend returns statistics
5. Frontend displays statistics cards
6. Frontend renders charts (monthly claims, policy distribution)
7. Frontend shows loading state during fetch

**Customer Dashboard**:
1. Customer navigates to dashboard
2. Frontend calls /api/customer/dashboard/stats
3. Backend calculates customer-specific statistics:
   - Counts customer's policies
   - Counts customer's claims
   - Breaks down claims by status
   - Gets recent claims
4. Backend returns statistics
5. Frontend displays statistics
6. Frontend shows recent claims list

### Pagination Flow

**General Pagination Process**:
1. User navigates to page with data table
2. Frontend fetches first page (page 0) from backend
3. Backend returns paginated response:
   - content: 10 items
   - currentPage: 0
   - totalPages: calculated
   - totalElements: total count
   - hasNext/hasPrevious: boolean flags
4. Frontend displays items in table
5. Frontend displays pagination controls
6. User clicks page number or next/previous
7. Frontend updates currentPage state
8. Frontend fetches new page from backend
9. Backend returns new page of data
10. Frontend updates table with new data
11. Pagination controls update

**Pagination Features**:
- Always shows pagination (even with less than 10 records)
- Shows "Showing X to Y of Z results"
- Previous/Next buttons
- Page number buttons
- Ellipsis for large page counts
- Disabled states for first/last page

---

## Database Schema

### Tables

#### users
- **id**: BIGINT (Primary Key, Auto-increment)
- **username**: VARCHAR (Unique)
- **password**: VARCHAR (BCrypt encrypted)
- **role**: ENUM (ADMIN, CUSTOMER)
- **enabled**: BOOLEAN
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

#### customers
- **id**: VARCHAR(36) (Primary Key, UUID)
- **customer_code**: VARCHAR(20) (Unique)
- **name**: VARCHAR
- **email**: VARCHAR (Unique)
- **phone**: VARCHAR
- **address**: VARCHAR
- **user_id**: BIGINT (Foreign Key to users)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

#### policies
- **id**: VARCHAR(36) (Primary Key, UUID)
- **policy_code**: VARCHAR(20) (Unique)
- **policy_type**: ENUM
- **coverage_amount**: DECIMAL(19,2)
- **start_date**: DATE
- **end_date**: DATE
- **status**: ENUM (ACTIVE, INACTIVE, EXPIRED)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

#### claims
- **id**: BIGINT (Primary Key, Auto-increment)
- **customer_id**: VARCHAR(36) (Foreign Key to customers)
- **policy_id**: VARCHAR(36) (Foreign Key to policies)
- **claim_date**: DATE
- **claim_amount**: DECIMAL(19,2)
- **status**: ENUM (SUBMITTED, IN_REVIEW, APPROVED, REJECTED)
- **description**: TEXT
- **remarks**: TEXT
- **evidence_url**: VARCHAR(500)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

#### customer_policies
- **id**: BIGINT (Primary Key, Auto-increment)
- **customer_id**: VARCHAR(36) (Foreign Key to customers)
- **policy_id**: VARCHAR(36) (Foreign Key to policies)
- **policy_number**: VARCHAR(10) (Unique per assignment)
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

#### activity_logs
- **id**: BIGINT (Primary Key, Auto-increment)
- **user_id**: BIGINT (Foreign Key to users)
- **action_type**: VARCHAR
- **details**: TEXT
- **created_at**: TIMESTAMP
- **updated_at**: TIMESTAMP

#### refresh_tokens
- **id**: BIGINT (Primary Key, Auto-increment)
- **user_id**: BIGINT (Foreign Key to users)
- **token**: VARCHAR (Unique, UUID)
- **expiry_date**: TIMESTAMP
- **created_at**: TIMESTAMP

### Relationships

- **User** ↔ **Customer**: One-to-one (if role is CUSTOMER)
- **Customer** ↔ **CustomerPolicy**: One-to-many
- **Policy** ↔ **CustomerPolicy**: One-to-many
- **Customer** ↔ **Claim**: One-to-many
- **Policy** ↔ **Claim**: One-to-many
- **User** ↔ **ActivityLog**: One-to-many
- **User** ↔ **RefreshToken**: One-to-many

---

## Security Implementation

### Authentication

**JWT Token Structure**:
- Header: Algorithm (HS256) and type (JWT)
- Payload: Username, role, userId, expiration
- Signature: HMAC SHA256 with secret key

**Token Storage**:
- Access token: localStorage (frontend)
- Refresh token: HTTP-only cookie (backend)

**Token Expiration**:
- Access token: 1 hour
- Refresh token: 7 days

### Authorization

**Role-Based Access Control**:
- **ADMIN**: Full access to all endpoints
- **CUSTOMER**: Access to own data and claim submission

**Endpoint Protection**:
- Public: /api/auth/login, /api/auth/refresh
- Protected: All other endpoints require valid JWT token
- Role-specific: Endpoints check user role using @PreAuthorize

### Password Security

- Passwords encrypted using BCrypt
- Default password for new customers: "Admin@123"
- Passwords never returned in API responses

### CORS Configuration

- Allows requests from frontend origin
- Permits necessary HTTP methods
- Enables credentials for cookie support

---

## API Endpoints

### Authentication Endpoints

- **POST /api/auth/login**: User login
- **POST /api/auth/refresh**: Refresh access token
- **POST /api/auth/logout**: User logout

### Customer Endpoints (Admin Only)

- **GET /api/admin/customers?page={page}**: Get paginated customers
- **GET /api/admin/customers/{id}**: Get customer by ID
- **POST /api/admin/customers**: Create customer
- **PUT /api/admin/customers/{id}**: Update customer

### Policy Endpoints (Admin Only)

- **GET /api/admin/policies?page={page}**: Get paginated policies
- **GET /api/admin/policies/{id}**: Get policy by ID
- **POST /api/admin/policies**: Create policy
- **PUT /api/admin/policies/{id}**: Update policy
- **POST /api/admin/policies/customers/{customerId}/assign**: Assign policy

### Claim Endpoints

**Customer**:
- **POST /api/claims**: Submit claim
- **GET /api/claims/me**: Get own claims

**Admin**:
- **GET /api/admin/claims?page={page}&status={status}&from={date}&to={date}**: Get paginated claims with filters
- **PUT /api/admin/claims/{id}/status**: Update claim status

### Activity Log Endpoints (Admin Only)

- **GET /api/admin/activity-logs?page={page}**: Get paginated activity logs
- **POST /api/admin/activity-logs**: Create manual log

### Dashboard Endpoints

- **GET /api/admin/dashboard/stats**: Admin dashboard statistics
- **GET /api/customer/dashboard/stats**: Customer dashboard statistics

---

## Key Implementation Details

### Pagination

- All list endpoints support pagination
- 10 records per page
- Page numbers are 0-indexed
- Backend uses Spring Data JPA Pageable
- Frontend uses Pagination component
- Always shows pagination controls (even with less than 10 records)

### Decimal Precision

- All amount fields use BigDecimal
- Database columns: DECIMAL(19,2)
- Supports decimal values (e.g., 1000.50, 5000.99)
- No floating-point precision errors

### Code Generation

- Customer codes: CUS0001, CUS0002, etc. (sequential)
- Policy codes: POL0001, POL0002, etc. (sequential)
- Policy numbers: Random 10-character alphanumeric
- Claim numbers: CLM-{YEAR}-{ID} format

### Activity Logging

- Automatic logging for:
  - Claim submissions
  - Claim status updates
- Manual logging available
- Includes user, action type, details, timestamp

### Error Handling

- Backend: GlobalExceptionHandler catches all exceptions
- Frontend: Service layer extracts error messages
- User-friendly error messages
- Proper HTTP status codes
- No technical error details exposed to users

### Loading States

- Table-level loading (not full page)
- Headers and filters remain visible during loading
- Loading spinner in table body
- "Loading data..." message

---

## Conclusion

This Insurance Management System provides a comprehensive solution for managing insurance policies, customers, and claims with proper authentication, authorization, and audit trails. The system is built with modern technologies and follows best practices for security, data handling, and user experience.

The documentation above covers every file, component, and flow in detail, providing a complete understanding of the system's architecture and implementation.
