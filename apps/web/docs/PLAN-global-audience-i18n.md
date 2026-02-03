# PLAN-global-audience-i18n

## 1. Context & Objective

Implement internationalization (i18n) for public Status Pages.
**Goal**: Allow status page visitors to view the page in their preferred language (English, Spanish, French, German) and allow Status Page owners to customize specific text labels via the database.

**Key Requirements**:

- **Scope**: Static UI labels ("Operational", "Incidents", etc.).
- **Method**: Detect browser locale -> switch to matching pack. Manual toggle available.
- **Stack**: `next-intl` (App Router).
- **Storage**: Database-backed configuration (Owner customization).

## 2. Architecture & Design

### 2.1 Database Schema (Prisma)

We need to store:

1.  Which languages are enabled for a specific Status Page.
2.  Any custom string overrides for those languages.

_New Model Idea:_

```prisma
model StatusPageI18n {
  id           String     @id @default(cuid())
  statusPageId String
  locale       String     // e.g., "en", "es", "fr", "de"
  enabled      Boolean    @default(true)
  overrides    Json?      // Store key-value pairs for text overrides: { "status.operational": "All Good" }
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  statusPage   StatusPage @relation(fields: [statusPageId], references: [id], onDelete: Cascade)

  @@unique([statusPageId, locale])
  @@index([statusPageId])
}
```

### 2.2 Next.js Middleware & Routing

- **Middleware**: `next-intl` middleware to handle locale detection from headers/cookies.
- **Routing**: `src/app/[domain]/[locale]/...` or just `src/app/[domain]/...` with cookie persistence?
  - _Decision_: Since custom domains are in use, path-based routing (`/es`, `/fr`) is standard and SEO friendly.
  - Sub-path routing: `status.example.com/es`

### 2.3 Translation Loading Strategy

`i18n/request.ts` will:

1. Load default JSON message pack (file-based) for the requested locale.
2. Fetch `StatusPageI18n` records for the current page.
3. Merge `overrides` JSON on top of default messages.
4. Return the merged message object to `next-intl` provider.

## 3. Implementation Phases

### Phase 1: Foundation & Dependencies

- [ ] **Install**: `npm install next-intl`
- [ ] **Config**: Create `src/i18n/request.ts` and `src/i18n/routing.ts`.
- [ ] **Middleware**: Update `middleware.ts` to use `next-intl` middleware (chained with existing auth/domain middleware).
- [ ] **Default Messages**: Create `src/messages/{en,es,fr,de}.json` with core keys:
  - `status.operational`
  - `status.major_outage`
  - `headings.past_incidents`
  - `actions.subscribe`

### Phase 2: Backend & Schema

- [ ] **Prisma**: Add `StatusPageI18n` model.
- [ ] **Migrate**: Run `bun db:push` or migration.
- [ ] **Actions**: Create `src/actions/i18n.ts`:
  - `updateLanguageSettings(statusPageId, locale, config)`
  - `getLanguageSettings(statusPageId)`

### Phase 3: Dashboard UI (Owner Experience)

- [ ] **Settings Tab**: Add "Localization" tab to Status Page Editor.
- [ ] **Language List**: Toggle switch for supported languages (EN, ES, FR, DE).
- [ ] **Customization Modal**: Editor for string overrides.
  - Select Language -> Form with fields for key labels (e.g., "Customize 'Operational' text").

### Phase 4: Public Page (Visitor Experience)

- [ ] **Layout**: Wrap Public Page `layout.tsx` with `NextIntlClientProvider`.
- [ ] **Components**: Refactor `StatusBadge`, `Header`, etc., to use `useTranslations()`.
  - Replace hardcoded strings with `t('key')`.
- [ ] **Language Switcher**: Add UI component (Dropdown/Globe icon) in the Footer or Header to switch locales manually.

## 4. Verification Checklist

- [ ] **Locale Detection**: Visiting from a "Spanish" browser setting should default to Spanish (if enabled).
- [ ] **Routing**: `/es` URL loads Spanish content.
- [ ] **Fallback**: Custom override text appears instead of default text if set in DB.
- [ ] **Fallback 2**: If a translation key is missing in DB override, it falls back to file JSON.
- [ ] **Persistence**: Switching language persists query param or cookie.

## 5. Technical Risks

- **Middleware Conflicts**: `better-auth` or custom domain middleware needs to chain correctly with `next-intl`.
- **Performance**: Fetching DB overrides on every request might be slow. _Mitigation_: Cache the `getMessages` result or rely on Next.js Request Memoization (standard in App Router).

## 6. Agent Assignment

- **Phase 1 & 2 & 4**: `frontend-specialist` (Handling logic, middleware, and rendering).
- **Phase 3**: `frontend-specialist` (Dashboard UI).
