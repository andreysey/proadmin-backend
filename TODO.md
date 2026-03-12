# ProAdmin Backend - NestJS Blueprint

## AI Collaboration Rules (Strictly Enforced)

1. **The "Why?" Rule**: Never blindly copy-paste. Before accepting a generated module (e.g., AuthGuard), the user must understand what every line does. Provide brief explanations for complex logic.
2. **Postman / Insomnia First**: Before integrating any endpoint with the React frontend, independently test it using an API client to verify JSON responses and error handling (e.g., 401 Unauthorized).
3. **Architecture Over Code**: Do not dump everything into a single file. Strictly follow the NestJS modular architecture (Controller -> Service -> Module) and adhere to FSD/GRASP principles for maintainability.
4. **English Only**: All code, comments, AI responses, and interactions must be strictly in English.

## Phase 1: Foundation & Database 🏗️
- [ ] Initialize NestJS project (`nest new proadmin-backend`).
- [ ] Configure ESLint and Prettier (strict rules).
- [ ] Set up a free cloud PostgreSQL database (e.g., Neon.tech or Supabase).
- [ ] Initialize Prisma ORM (`npx prisma init`).
- [ ] Create the base `User` model in `schema.prisma` (id, email, password, role, createdAt).
- [ ] Run the first database migration (`npx prisma migrate dev`).

## Phase 2: Authentication (JWT) 🔒
- [ ] Install dependencies (`@nestjs/jwt`, `@nestjs/passport`, `bcrypt`).
- [ ] Generate `AuthModule`, `AuthService`, and `AuthController`.
- [ ] Implement password hashing with `bcrypt` (before saving to DB).
- [ ] Implement `POST /auth/register` endpoint (Create user).
- [ ] Implement `POST /auth/login` endpoint (Validate password & generate JWT).
- [ ] Create a custom `JwtAuthGuard` to protect private routes.

## Phase 3: Users & Role-Based Access Control (RBAC) 👥
- [ ] Generate `UsersModule` (CRUD operations).
- [ ] Implement `GET /users/me` endpoint (Get current user profile).
- [ ] Create a `@Roles()` decorator and `RolesGuard` for access control.
- [ ] Implement `GET /users` endpoint (ADMIN only - list all users).
- [ ] Implement `PATCH /users/:id` endpoint (Update data; ADMIN can edit all, USER can edit self).
- [ ] Implement `DELETE /users/:id` endpoint (Delete user, ADMIN only).

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