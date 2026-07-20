# AI Coding Rules & Guardrails - PariVaar

## 1. Libraries and Tech Stack
* **Frontend**:
  * Use React 18, Tailwind CSS v4, and `@xyflow/react` for visualization.
  * Avoid adding new UI component libraries (e.g., Material UI, Chakra UI, Radix) unless explicitly requested by the user.
  * Utilize `lucide-react` for standard icons.
  * Use `axios` for API calls.
* **Backend**:
  * Use Spring Boot 3.3.x with Java 17.
  * Leverage Spring Data JPA for persistence.
  * Use `jjwt` (version 0.12.3) for JWT token building and parsing.
  * Do not add additional external Maven dependencies without confirmation.

---

## 2. Coding Boundaries & Best Practices
* **Database Isolation**:
  * All database operations querying or updating `Person`, `Relationship`, or `NoteDocument` records must explicitly check and match the `user_id` of the authenticated user to prevent unauthorized access to other users' trees.
* **API Guidelines**:
  * Use standard REST patterns with structured JSON response bodies.
  * Leverage `com.example.family.exception` for global exception handling.
* **Secret Management**:
  * Never hardcode database credentials, client IDs, or JWT secret keys.
  * Reference these values via environment variables or Spring `application.properties`.

---

## 3. UI Guardrails
* **No Unsolicited UI Changes**: Do not change the overall design, colors, layouts, or visual aesthetics of the UI unless the user specifically instructs you to modify them.
* **Tailwind CSS Rules**: Leverage Tailwind CSS v4 utility classes or the established design tokens in `index.css`.

---

## 4. Error Handling & Logging
* **Backend**:
  * Provide descriptive HTTP status codes:
    * `400 Bad Request` for invalid input parameters.
    * `401 Unauthorized` for missing or invalid tokens.
    * `403 Forbidden` for tenant cross-access.
    * `404 Not Found` for missing resources.
  * Log significant operations and errors using SLF4J / Logback standard patterns.
* **Frontend**:
  * Display clear error messages to users when network operations fail, avoiding raw stack trace prints in generic UI divs.
