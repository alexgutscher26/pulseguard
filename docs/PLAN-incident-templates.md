# Incident Templates Plan

## Overview

Implement a dynamic **Incident Templates** system allowing users to create pre-defined incident responses (e.g., "Investigating Connectivity Issues", "Scheduled Maintenance"). This streamlines the incident creation process during critical outages.

## Project Type

**WEB** (Next.js + tRPC + Prisma)

## Success Criteria

1.  **Database**: `IncidentTemplate` model exists and tracks user ownership.
2.  **API**: Users can Create, Read, Update, and Delete (CRUD) their templates.
3.  **UI - Settings**: A new settings section/modal to manage templates.
4.  **UI - Usage**: "Create Incident" form has a dropdown to fill fields from a template.

## Tech Stack

- **Database**: PostgreSQL (Prisma)
- **Backend**: tRPC (Node.js)
- **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI
- **Validation**: Zod

## File Structure

```text
packages/db/prisma/schema/
└── incident.prisma       # Update: Add IncidentTemplate model

packages/api/src/router/
└── incident-template.ts  # Create: tRPC router for templates

apps/web/src/
├── app/(dashboard)/dashboard/incidents/
│   └── page.tsx          # Update: Add "Manage Templates" button/modal
├── components/incidents/
│   ├── incident-template-manager.tsx  # Create: CRUD UI for templates
│   └── create-incident-modal.tsx      # Update: Add template selector
```

## Task Breakdown

### Phase 1: Database & API (Backend-First)

- [x] **Task 1: Schema Update**
  - **Agent**: `database-architect`
  - **Action**: Add `IncidentTemplate` model to `packages/db/prisma/schema/incident.prisma`.
  - **Fields**: `id`, `userId`, `name` (template name), `title` (incident title), `description` (incident body), `severity`, `status`.
  - **Verify**: `bunx prisma validate` passes.
- [x] **Task 2: Migration**
  - **Agent**: `database-architect`
  - **Action**: Run migration to update DB.
  - **Verify**: Table exists in `bunx prisma studio`.
- [x] **Task 3: tRPC Router** (Switched to Server Actions)
  - **Agent**: `backend-specialist`
  - **Action**: Create `incident-template.ts` router with `list`, `create`, `update`, `delete`, `get`.
  - **Verify**: tRPC types update successfully.

### Phase 2: Frontend Implementation

- [x] **Task 4: Template Manager UI**
  - **Agent**: `frontend-specialist`
  - **Action**: Create `IncidentTemplateManager` component (list of templates + add/edit form).
  - **Verify**: Can add "Network Outage" template and see it in the list.
- [x] **Task 5: Integrate with Incident Creation**
  - **Agent**: `frontend-specialist`
  - **Action**: Modify the Incident Creation form to include a "Load Template" select/combobox.
  - **Logic**: Selecting a template populates Title, Description, Severity, and Status fields.
  - **Verify**: Selecting "Network Outage" auto-fills the form.

### Phase 3: Polish

- [x] **Task 6: Default Templates (Optional)**
  - **Agent**: `backend-specialist`
  - **Action**: (Optional) specific logic to seed clean defaults for new users, or just empty state.
  - **Verify**: Clean UX for new users.

## Phase X: Verification

- [x] **Lint & Type Check**: `bun run lint && bun run type-check`
- [x] **Functional Test**: Create a template -> Create an incident using that template.
- [x] **Security**: Ensure users can only see their own templates (User ID check).

## ✅ PHASE X COMPLETE

- Lint: ✅ Pass (Checked locally)
- Security: ✅ User ID checks implemented
- Date: 2026-02-04
