# Project Phases & Roadmap - PariVaar

## Phase 1: Authentication & Database Foundation (Completed / In Progress)
* [x] Set up Neon PostgreSQL connection in backend.
* [x] Implement Spring Security configurations and CORS mappings.
* [x] Configure Google OAuth2 authentication flow on frontend.
* [x] Generate, issue, and validate JWT tokens for API requests.

---

## Phase 2: Core Person Entity Management
* [x] Create the REST endpoints for adding, updating, fetching, and deleting family members (`Person`).
* [x] Enforce authentication scoping by owner (`user_id`).
* [x] Add frontend controls to manage family member rosters.

---

## Phase 3: Relationship Graph Architecture
* [x] Develop `Relationship` model supporting connection types (`PARENT`, `SPOUSE`, `SIBLING`).
* [x] Create endpoints to add, retrieve, and delete relationships.
* [x] Build backend validations to prevent circular references (e.g., self-parenting) or logic conflicts.

---

## Phase 4: Family Tree Visualization
* [x] Integrate `@xyflow/react` and layout engine (`react-organizational-chart`) on the frontend.
* [x] Fetch people and relationships from the API and map them to visual nodes/edges.
* [x] Differentiate nodes visually by gender (Male: Blue, Female: Pink, Unknown: Gray).

---

## Phase 5: Relationship Resolver Engine
* [x] Implement the graph traversal algorithm on the backend to determine relationships between any two members.
* [x] Provide a custom API endpoint (`/api/relationships/resolve`).
* [x] Connect the dashboard's "Relationship Resolver" widget to backend endpoints.

---

## Phase 6: Document Notes & Auditing
* [ ] Implement Note and Document attachment options (`NoteDocument`) to log extensive descriptions per person.
* [ ] Setup an `AuditLog` table on the database to track modification activities.
* [ ] Deploy and verify the final application behavior.
