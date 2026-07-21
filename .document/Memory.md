# Project Memory - PariVaar

## 1. Project Context
* **Project Name**: PariVaar
* **Domain**: Interactive Family Tree mapping and relationship resolving.
* **Core Technology Stack**: Spring Boot (Java 17) + React 18 (Vite, `@xyflow/react`, Tailwind CSS v4).

---

## 2. Active Database and API Configurations
* **Database Platform**: PostgreSQL via Neon Serverless Postgres.
* **Security & Session Setup**:
  * Spring Security enabled.
  * Google OAuth2 token validation.
  * Custom JWT session generation & retrieval.
* **Main API Entities**:
  * `Person` (representing family members, scoped under `user_id` email columns).
  * `Relationship` (`SPOUSE`, `PARENT`, `SIBLING` relations between `Person` records).
  * `NoteDocument` (markdown attachments for members).
  * `AuditLog` (activity logging).

---

## 3. Active Directory References
* Main entry point backend: [FamilyApplication.java](file:///c:/Users/tusha/Desktop/Project-PariVaar/PariVaar/src/main/java/com/example/family/FamilyApplication.java)
* Maven configuration: [pom.xml](file:///c:/Users/tusha/Desktop/Project-PariVaar/PariVaar/pom.xml)
* Frontend configuration: [package.json](file:///c:/Users/tusha/Desktop/Project-PariVaar/PariVaar/frontend/package.json)
* Styling Sheet: [index.css](file:///c:/Users/tusha/Desktop/Project-PariVaar/PariVaar/frontend/src/index.css)
