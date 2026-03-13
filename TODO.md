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

## Phase 4: Frontend Integration & Polish 🚀
- [ ] Enable CORS in NestJS (allow React frontend to make requests).
- [ ] Set up Swagger documentation (`@nestjs/swagger`) for easy API testing.
- [ ] Integrate JWT auth into the React frontend (store token, attach to Authorization header).
- [ ] Update frontend UI based on user role (hide admin buttons for regular users).

## Phase 5: Deployment 🌍
- [ ] Set up environment variables (`.env`) for production.
- [ ] Deploy PostgreSQL database (if not already using Neon/Supabase cloud).
- [ ] Deploy NestJS application to Render.com (Free Tier).
- [ ] Update CORS settings to accept requests from the deployed Vercel frontend domain.