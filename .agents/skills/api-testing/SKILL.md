---
name: api-testing
description: Guidelines and steps for testing NestJS API endpoints using Postman or Insomnia.
---
# API Testing Skill

Use this skill to ensure all endpoints are properly verified before being considered complete.

## When to use this skill
- After implementing a new controller endpoint.
- After modifying existing endpoint logic or DTOs.
- Before integrating a backend feature with the frontend.

## How to use it

1. **Start the Server**: Run `npm run start:dev` to ensure the API is reachable.
2. **Identify Request Details**:
    - Method (GET, POST, etc.)
    - URL (e.g., `http://localhost:3000/auth/register`)
    - Headers (e.g., `Content-Type: application/json`)
    - Body (JSON schema)
3. **Test Successful Path**: Send valid data and verify the status code (200/201) and JSON response structure.
4. **Test Error Paths**:
    - Send missing required fields (expect 400).
    - Send invalid data formats (expect 400).
    - Send unauthorized requests to protected routes (expect 401).
5. **Verify Database Side-Effects**: If the endpoint modifies data (e.g., registration), verify the change in the database using Prisma Studio or query tools.
