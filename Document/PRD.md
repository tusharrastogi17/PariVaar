# Project Requirements Document (PRD) - PariVaar

## 1. Overview & Goal
**PariVaar** is a family relationship tree and graph engine application. The name "PariVaar" translates to "Family" in Hindi. The primary goal of the app is to allow users to build, visualize, and interact with their family tree, add notes/documents for individual family members, and query/resolve complex relationships between family members (e.g., finding how Person A is related to Person B).

---

## 2. Target Users
* **Individuals & Families**: Looking to preserve, document, and map their lineage, ancestry, and relations in an interactive visual format.
* **Genealogists & Historians**: Who need a structured graph database/engine to resolve and maintain relationships and associate notes/documents with individual nodes.

---

## 3. Core Features
### A. Authentication
* Secure login using Google OAuth2.
* Session management via JSON Web Tokens (JWT).

### B. Family Tree Visualization
* Interactive visual rendering of the family tree using nodes and connectors (`@xyflow/react`).
* Node-based badges representing gender, names, and relationship status.

### C. Relationship Management
* Add new family members (Person records) with basic properties (Name, Gender).
* Create linkages/connections (Relationship records) between two family members:
  * **Supported Relation Types**: `SPOUSE`, `PARENT`, `SIBLING`.
* Restrict editing/creation rights to records owned by the authenticated user (`user_id` mapping).

### D. Relationship Resolver
* An engine that traverses the family graph to determine the path and exact relation type between two arbitrary people (e.g., inputting Person A and Person B and receiving the relationship connection).

### E. Note and Document Management
* Ability to append markdown-based notes or documents (e.g., history, key events, details) to any specific family member.

### F. Audit Logs
* Action tracking for operations (creation, modification, and deletion of nodes/edges) to maintain integrity and change history.
