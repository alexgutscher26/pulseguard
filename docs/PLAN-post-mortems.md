# Plan: Incident Post-Mortems & AI Reporting

> **Goal:** specific implementation of a persistent Post-Mortem recording system for resolved incidents, featuring AI-assisted summarization and Markdown export.

## 1. Context & Requirements

### Key Decisions (Confirmed)

- **Persistence:** **Stored Model**. Post-mortem data is saved in the database (`PostMortem` model), not just transiently generated.
- **Trigger:** Available automatically when Incident status is `RESOLVED`.
- **Structure:**
  - **Auto-Generated:** Timeline summary (via LLM).
  - **Manual/Editable:** Root Cause Analysis (RCA), Impact Scope, Detection Method, Action Items.
- **Export:** One-click generation of a Markdown report.

### Tech Stack

- **Database:** Prisma (PostgreSQL) - New `PostMortem` model.
- **AI Integration:** Vercel AI SDK (or direct provider call) for summarizing `IncidentEvent` logs into a narrative.
- **Frontend:** Post-Mortem Editor (Rich Text or Markdown Editor) in the Incident Details view.

---

## 2. Architecture & Schema Design

### 2.1 Database Schema (Prisma)

We need a one-to-one relationship between `Incident` and `PostMortem`.

```prisma
// packages/db/prisma/schema/incident.prisma

model PostMortem {
  id              String    @id @default(cuid())
  incidentId      String    @unique
  incident        Incident  @relation(fields: [incidentId], references: [id], onDelete: Cascade)

  // Content Fields
  summary         String    @db.Text // AI-generated, user editable
  rootCause       String    @db.Text
  impactScope     String    @db.Text
  detectionMethod String    @db.Text
  actionItems     String    @db.Text // Simple text or could be JSON list

  // Metadata
  status          PostMortemStatus @default(DRAFT)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum PostMortemStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### 2.2 AI Summarization Flow

1. **Input:** Fetch all `IncidentEvent` records for the incident.
2. **Prompt:** "Analyze these events and generate a professional incident summary timeline..."
3. **Output:** Stream/Write text to the `summary` field of the `PostMortem`.

---

## 3. Task Breakdown

### Phase 1: Database & Core Models

- [ ] **Schema Update:** Add `PostMortem` and `PostMortemStatus` to `incident.prisma`.
- [ ] **Migration:** Run `bunx prisma migrate dev --name add_post_mortem`.
- [ ] **Seed/Verify:** Ensure relations work correctly in Prisma Studio.

### Phase 2: AI & Backend Logic

- [ ] **AI Service:** Implement `generateIncidentSummary(incidentId)` server action.
  - Requires setting up an AI provider (if not present) or a simple rule-based fallback initially.
- [ ] **CRUD Actions:**
  - `createPostMortem(incidentId)`
  - `updatePostMortem(id, data)`
  - `getPostMortem(incidentId)`

### Phase 3: Frontend UI (Incident Details)

- [ ] **Post-Mortem Tab:** Add a new tab/section to `IncidentDetailsPage` (visible only if Resolved).
- [ ] **Editor Component:**
  - Fields for RCA, Impact, Detection, Actions.
  - "Generate Summary with AI" button.
  - Autosave functionality.
- [ ] **Export Feature:** "Download as Markdown" button.
  - Client-side generation of a `.md` file combining all fields.

### Phase 4: Verification

- [ ] **Test:** Create an incident -> Resolve it -> Create Post-Mortem -> Edit -> Save -> Export.
- [ ] **Verify:** Check that the AI summary is accurate/reasonable (if enabled).

---

## 4. Agent Strategy

| Task Scope         | Primary Agent         | Stats                                             |
| :----------------- | :-------------------- | :------------------------------------------------ |
| **Schema & Data**  | `backend-specialist`  | Ensure 1:1 integrity with Incidents.              |
| **AI Integration** | `backend-specialist`  | Robust prompt engineering for Event -> Narrative. |
| **UI/Editor**      | `frontend-specialist` | Clean, distraction-free writing experience.       |

## 5. Next Steps

1. **Review Schema:** Check `packages/db/prisma/schema/incident.prisma`.
2. **Run:** `/create` to start Phase 1.
