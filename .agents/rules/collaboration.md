# AI Collaboration Rules

## The "Why?" Rule
Never blindly copy-paste. Before accepting a generated module (e.g., AuthGuard), provide a brief explanation for complex logic to ensure understanding.

## Postman / Insomnia First
Before integrating any endpoint with the frontend, independently test it using an API client to verify JSON responses and error handling (e.g., 401 Unauthorized).

## Architecture Over Code
Strictly follow the NestJS modular architecture (Controller -> Service -> Module) and adhere to FSD/GRASP principles for maintainability. Do not dump everything into a single file.
