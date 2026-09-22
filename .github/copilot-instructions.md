# TalayProject — Copilot Instructions

Full-stack profile management app: ASP.NET Core (net10.0) API in `backend/UserProfile.Api`, React 19 + TS + Vite SPA in `frontend/`.

## Architecture

**Frontend → Atomic Design.** **Backend → Vertical Slice Architecture.** Apply both for all new code; migrate existing files opportunistically when you touch them (don't do a big-bang rewrite unless asked).

### Frontend: Atomic Design (`frontend/src/components/`)

Organize components into tiers by composition complexity, each in its own subfolder:

```
components/
  atoms/        # smallest, no business logic, style-only (Button, Input, Badge, Icon, Spinner)
  molecules/    # small groups of atoms with one job (FormField, Toast, StatCard, LoadingSkeleton)
  organisms/    # composed, feature-aware sections (ProfileForm, ProfileCard, Sidebar, Topbar, RecentProfiles, ConfirmDialog, ErrorBanner)
  templates/    # page-level layout skeletons that arrange organisms, no data fetching
  pages/        # route-level components: wire templates to hooks/API calls and state
```

Rules:
- Each component keeps its colocated `ComponentName.css` (existing convention) inside the same tier folder.
- An atom must not import a molecule/organism; dependencies only flow downward (pages → templates → organisms → molecules → atoms).
- Data fetching (`api/profileApi.ts` calls) belongs in `pages/` (or hooks called from pages), never inside atoms/molecules.
- When creating a new component, decide its tier by asking "what does it compose?" — if it composes other custom components, it's not an atom.
- Existing flat files under `components/` (e.g. `ProfileCard.tsx`, `Sidebar.tsx`) have not been migrated yet; when editing one, consider moving it into the right tier folder alongside its `.css` file and updating imports.

### Backend: Vertical Slice Architecture (`backend/UserProfile.Api/`)

Prefer feature-first folders over technical-layer folders (`Controllers/`, `Models/`, `Services/`). For new features, create a `Features/<FeatureName>/` folder containing everything that feature needs:

```
Features/
  Profiles/
    GetProfiles/          # request/response DTOs + endpoint/handler for listing
    GetProfileById/
    CreateProfile/
    UpdateProfile/
    DeleteProfile/
    Profile.cs             # shared domain entity for the slice (if truly shared)
    ProfileStore.cs         # shared data-access for the slice (if truly shared)
```

Rules:
- Each slice folder owns its own request/response models — don't put them in a shared `Models/` folder unless genuinely reused across many slices.
- Prefer one endpoint (minimal API route or a thin controller action) per slice; avoid growing a single controller with many unrelated actions.
- Cross-slice shared code (e.g. `ProfileStore`, `Profile` entity) can live at the feature root (`Features/Profiles/`) rather than duplicated per slice.
- The current `Controllers/`, `Models/`, `Services/` layout is legacy layered architecture; when adding a new endpoint, prefer starting a `Features/` slice instead of adding another action to `ProfilesController`. Don't migrate existing endpoints unless asked.

## Build and Test

- Backend: `dotnet build UserProfile.slnx` (from repo root). Runs on port 5100.
- Frontend: `npm run dev` (Vite dev server, port 5173, proxies `/api` → `http://localhost:5100`). Frontend code must call the API via relative `/api/...` paths, not absolute URLs.
- Frontend lint: `npm run lint` (oxlint). Frontend build: `npm run build` (`tsc -b && vite build`).
- No `*.Tests` project exists yet in the backend.

## Conventions

- Dark-only dashboard theme; tokens defined in `frontend/src/index.css` (`--page-bg`, `--shell-bg`, `--sidebar-bg`, `--panel-bg`, `--panel-raised`, `--field-bg`, `--border`, `--text-primary/secondary/muted`, `--accent`, `--danger`, `--warning`, `--info`). Border radius ≤ 8px, letter-spacing 0, no `prefers-color-scheme` switching.
- `App.css` only holds app-shell grid layout, generic resets, and a few integration-only classes (`workspace-heading`, `profile-list`, `empty-state`) — don't centralize component styles there.
- See [UI-IMPROVEMENT-SPEC.md](../UI-IMPROVEMENT-SPEC.md) for the larger multi-workstream UI plan and file-ownership rules when parallelizing work across subagents.
