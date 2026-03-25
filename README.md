# ProAdmin Backend (NestJS)

Backend service for [proadmin-dashboard](https://github.com/andreysey/proadmin-dashboard).

## Features
- **Auth**: JWT-based authentication (Register/Login).
- **ORM**: Prisma 7 with PostgreSQL.
- **Security**: RBAC (Role-Based Access Control) - *In Progress*.

## Documentation
Interactive API documentation built with **Swagger** is available at:
- **Local**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Production**: [https://proadmin-backend.onrender.com/docs](https://proadmin-backend.onrender.com/docs)

Testing your endpoints through Swagger is the best way to verify your backend logic independently of the frontend.

## Local Development
1. `npm install`
2. Configure `.env` (DATABASE_URL, JWT_SECRET).
3. `npx prisma generate`
4. `npm run start:dev`

The backend runs on `http://localhost:3000` with the global prefix `/api`. It accepts requests from the dashboard at `http://localhost:5173`.
