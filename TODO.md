# ProAdmin Backend - NestJS Blueprint

## Project Rules
> [!NOTE]
> Project rules and workflows are now managed in the `.agents/` directory for better context persistent. See `.agents/rules` and `.agents/workflows`.

## Phase 1: Foundation & Database 🏗️
- [x] Initialize NestJS project (`proadmin-backend`).
- [x] Configure ESLint and Prettier (strict rules).
- [x] Set up a free cloud PostgreSQL database (e.g., Neon.tech or Supabase).
- [x] Initialize Prisma ORM (`npx prisma init`).
- [x] Create the base `User` model in `schema.prisma` (id, email, password, role, createdAt).
- [x] Run the first database migration (`npx prisma migrate dev`).

## Phase 2: Authentication (JWT) 🔒
- [x] Install dependencies (`@nestjs/jwt`, `@nestjs/passport`, `bcrypt`).
- [x] Generate `AuthModule`, `AuthService`, and `AuthController`.
- [x] Implement password hashing with `bcrypt` (before saving to DB).
- [x] Implement `POST /auth/register` endpoint (Create user).
- [x] Implement `POST /auth/login` endpoint (Validate password & generate JWT).
- [x] Create a custom `JwtAuthGuard` to protect private routes.

## Phase 3: Users & Role-Based Access Control (RBAC) 👥
- [x] Generate `UsersModule` (CRUD operations).
- [x] Implement `GET /users/me` endpoint (Get current user profile).
- [x] Create a `@Roles()` decorator and `RolesGuard` for access control.
- [x] Implement `GET /users` endpoint (ADMIN only - list all users).
- [x] Implement `PATCH /users/:id` endpoint (Update data; ADMIN can edit all, USER can edit self).
- [x] Implement `DELETE /users/:id` endpoint (Delete user, ADMIN only).
- [x] Implement `PATCH /users/bulk-update` endpoint (Efficient batch role changes).
- [x] Enforce strict DTO validation for all User operations.

## Phase 4: Frontend Integration & Polish 🚀
- [x] Enable CORS in NestJS (allow React frontend to make requests).
- [x] Set up Swagger documentation (`@nestjs/swagger`) for easy API testing.
- [x] Implement pagination, searching, and sorting for the users list.
- [x] Update login and registration to use `username` (matching frontend requirements).

## Phase 5: Deployment 🌍
- [x] Set up environment variables (`.env`) for production.
- [x] Create a `render.yaml` blueprint for Render.com.
- [x] Implement health check endpoint and parameterized CORS.
- [ ] Deploy NestJS application to Render.com (Free Tier).
- [ ] Update CORS settings to accept requests from the deployed Vercel frontend domain.