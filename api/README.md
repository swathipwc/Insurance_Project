# Insurance Backend (Admin & Customer)

Monolithic Spring Boot backend for Insurance Policy & Claim Management System.

Roles:
- ADMIN
- CUSTOMER

## Quick start

1. Import into your IDE (VS Code / IntelliJ) as Maven project.
2. Create MySQL database:

   ```sql
   CREATE DATABASE insurance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Edit `src/main/resources/application.yml` and set your MySQL `username` and `password`.
4. Run:

   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. Login with seeded users:

   - Admin:

     ```json
     POST /api/auth/login
     {
       "username": "admin",
       "password": "admin123"
     }
     ```

   - Customer:

     ```json
     {
       "username": "customer1",
       "password": "cust123"
     }
     ```

Use the returned JWT token as `Authorization: Bearer <token>` for other endpoints.
