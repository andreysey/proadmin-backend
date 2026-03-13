---
description: How to setup and verify a new NestJS module/feature
---
# Feature Development Workflow

This workflow guides the development of new features in the NestJS backend, following the modular architecture and the project's collaboration rules.

1. **Plan the Feature**: Define the module, service, and controller needs.
2. **Generate Files**: Use `npx nest generate ...` to create the boilerplate.
3. **Define DTOs**: Create Data Transfer Objects for request validation using `class-validator`.
4. **Implement Service**: Write the business logic in the Service.
5. **Implement Controller**: Create the endpoints in the Controller.
6. // turbo
7. **Build and Check**: Run `npm run build` to ensure there are no compilation errors.
8. **Test with Postman**: Before notifying completion, verify endpoints with an API client.
