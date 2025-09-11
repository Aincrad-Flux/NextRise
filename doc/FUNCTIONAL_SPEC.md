# NextRise Functional Documentation

## 1. Purpose & Vision
NextRise is a platform connecting Startups, Investors, and Administrators to streamline discovery, evaluation, collaboration, and portfolio tracking. The goal is to reduce friction in sourcing opportunities, enable startups to present their profile and traction clearly, and provide investors/admins with structured, filterable data and lightweight workflow tools (review, invest interest, messaging placeholder).

## 2. Scope (Current Release)
In-scope (MVP / current codebase):
- Authentication & session management (login, register, logout, current user context)
- Role-based UI variants (Startup, Investor, Admin)
- Dashboards for each role (startup activity, investor portfolio/projects, admin oversight)
- Project listing, project detail modal, project creation form (modal based)
- Startup profile & list of startup projects
- Data browsing panels: Events, News, Opportunities
- Investor project views (all vs invested/followed mock state)
- Simple messaging placeholder screen (UI only)
- Sidebar + top bar navigation shell with avatar menu & theme toggle (light/dark)
- Data manager / admin style components for manual data handling (UI scaffold)
- Static / mock datasets (events, investors, projects, startups) pending backend integration
- Logging utility (frontend console/file ready) and basic error boundary surfaces (implicit)

Out of scope (future / not fully implemented):
- Real-time messaging
- Investment transaction workflow (commit, term sheet, etc.)
- Advanced search with faceted filters & relevance scoring
- Notification system
- Multi-tenant / organization isolation
- Granular permission management
- Internationalization

## 3. User Roles & Goals
| Role | Primary Goals |
|------|---------------|
| Startup User | Publish company profile, create/manage projects, gain visibility with investors, monitor interest. |
| Investor User | Discover startups/projects, evaluate details, track interested portfolio, manage pipeline. |
| Admin User | Oversee system data quality, moderate content, bootstrap/import datasets, manage users. |

## 4. Core Functional Features
1. Authentication: Basic credential-based auth with session persistence (see `SessionProvider.jsx`).
2. Role-aware Navigation: Sidebar & dashboards adapt to role context.
3. Project Management (Startup): Create/view projects via modal forms; stored in front-end state/mock for now.
4. Project Discovery (Investor): Browse all projects; toggle invested vs all views (uses context `InvestorProjectsContext.jsx`).
5. Data Panels: Events, News, Opportunities display curated static lists (placeholder for API-backed feeds).
6. Profile & Startup Views: Startup profile page shows organization info and related projects.
7. Theming & Layout: Dark/light toggle, responsive layout components (TopBar, Sidebar, Dashboard shells).
8. Admin Data Manager: UI surface for future CRUD/import (currently structural only).
9. Logging & Diagnostics: `logger.js` helper for standardized client logging.
10. Error & Empty States: NotFound page + placeholder messaging screen.

## 5. Key User Journeys
### 5.1 Startup: Onboard & Publish First Project
1. User registers & logs in as Startup.
2. Lands on Startup dashboard (`StartupHome.jsx`).
3. Opens project creation modal (`ProjectFormModal.jsx`).
4. Submits project (validated locally) → project list updates (state refresh in projects context / parent component).
5. Project visible in Startup Projects page and Investor browsing view.

Success Criteria:
- New project appears immediately without full reload.
- Modal closes cleanly; form state resets on reopen.

### 5.2 Investor: Discover and Track Opportunities
1. Investor logs in → Investor dashboard (`InvestorHome.jsx`).
2. Navigates to Projects → default 'All Projects' list (`Projects.jsx`).
3. Opens a specific project (modal `ProjectModal.jsx`) to view details.
4. Marks interest (future enhancement) or conceptually adds to 'Invested' (currently mock toggling path via `InvestorProjectsInvested.jsx`).
5. Switches tab to 'Invested Projects' to review curated subset.

Success Indicators:
- Context state isolates invested list.
- Re-navigation preserves invested subset until refresh.

### 5.3 Admin: Data Oversight & Import Preparation
1. Admin logs in → Admin dashboard (`AdminHome.jsx` + `AdminDashboard.jsx`).
2. Opens Data Manager (`DataManager.jsx`).
3. Views mock datasets (events/investors/projects) with intent to validate structure.
4. (Future) Triggers import pipeline (placeholder for backend `importIncubator.js`).

Success Indicators:
- Admin can navigate between resource panels with no role leakage.
- Layout stable under varying dataset lengths.

### 5.4 Cross-Journey: Navigation & Theme Consistency
1. Any user toggles theme via top bar (moon/sun icons).
2. Navigates across major sections (Projects, News, Events).
3. Theme state persists during SPA navigation (in-memory) until refresh.

### 5.5 Failure Path: Unauthenticated Access
1. User attempts to access a protected dashboard route without active session.
2. System redirects or shows login page (`Login.jsx`).
3. After successful login, redirected to role-appropriate landing screen.

## 6. Data Model (Current Frontend Mock)
Entities (approximate fields based on `data/`):
- Project: id, title, description, sector/tags, status, funding stage, owner/startupId, metrics (mock)
- Startup: id, name, logo/avatar ref, description, location, founders (future), projects[]
- Investor: id, name, focus sectors, portfolioIds (mock), avatar
- Event: id, title, date, location, summary
- News Item: id, title, publishedAt, source, link

Persistence: In-memory arrays (JS modules). No live mutation persistence beyond session; refresh resets to seed data.

## 7. Permissions & Access Control (Lightweight)
- Startup: Can view all public data + manage own projects (front-end restricted; real enforcement pending backend).
- Investor: Read-only across public startup/project data; curated invested subset (local state only now).
- Admin: Superset navigation; future CRUD controls.
- Unauthenticated: Limited to public marketing / eventually a landing page (currently login or generic pages accessible depending on routing decisions).

Risk (Gap): No true server-side authorization yet; relies on upcoming backend endpoints (`/api/auth/*`).

## 8. Non-Functional Requirements (Target)
| Category | Requirement |
|----------|------------|
| Performance | Initial route load < 2s on broadband; modal open < 150ms; list rendering stable up to 500 projects (virtualization future if needed). |
| Usability | Accessible color contrast; keyboard focusable modals; distinct empty states. |
| Reliability | Graceful handling of missing datasets (fallback arrays). |
| Security | Basic session token handling; future: secure cookies + CSRF + rate limiting (backend). |
| Scalability | Front-end architecture ready to swap mock data for API services via `userApi.js` and future data service modules. |
| Observability | Extend `logger.js` to external logging pipeline later. |

## 9. Assumptions
- Single-organization context; no multi-tenant isolation needed initially.
- Investor 'invested' list is a client-managed subset until backend favorites/watchlist endpoint exists.
- Projects are globally visible unless future privacy flags introduced.
- Authentication tokens will be provided via backend integration (Supabase or custom).

## 10. Constraints
- Current absence of backend persistence limits true CRUD validation.
- No SSR-specific performance tuning yet (pure client Vite build).
- Limited form validation (client-only, minimal schema enforcement).

## 11. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Mock data divergence from backend schema | Rework costs | Introduce shared TypeScript interfaces soon. |
| Expanding project list affects render perf | UX degradation | Add windowing (react-window) when >300 items. |
| Ambiguous role-based access | Security holes | Centralize auth checks in a guard/HOC when backend live. |
| Modal-driven forms grow complex | Maintainability | Migrate to dedicated route pages if form logic expands. |

## 12. Near-Term Roadmap (Next Iterations)
1. Integrate real backend auth & project CRUD endpoints.
2. Add invested/favorites persistence (API) + watchlist tagging.
3. Implement advanced project filtering (sector, stage, tags search).
4. Real messaging MVP (threaded conversations, unread badge).
5. Admin import tooling tied to `importIncubator.js` pipeline + progress UI.
6. Replace static News/Events with live feeds (RSS/API ingestion).
7. Introduce type safety (migrate to TypeScript) & shared model contract.
8. Add notification/toast system for user feedback.

## 13. Acceptance Summary (MVP Definition of Done)
- Users (all roles) can authenticate and reach a role-specific dashboard.
- Startup can add a project; appears instantly in global project browsing.
- Investor can differentiate all vs invested lists (even if mock) without errors.
- Admin can view structural panels for datasets without navigation errors.
- Core navigation (sidebar/top bar) works across major pages with theme toggle stable.
- 0 critical console errors during standard journeys.

## 14. Appendix: Key Components Mapping
| Feature | Component(s) |
|---------|--------------|
| Session/Auth Context | `SessionProvider.jsx`, `userApi.js` |
| Project Listing & Modal | `Projects.jsx`, `ProjectCard.jsx`, `ProjectModal.jsx`, `ProjectFormModal.jsx` |
| Investor Views | `InvestorProjectsAll.jsx`, `InvestorProjectsInvested.jsx`, `InvestorProjectsContext.jsx` |
| Startup Dashboard | `StartupHome.jsx`, `StartupProjects.jsx` |
| Admin Dashboard & Data | `AdminHome.jsx`, `AdminDashboard.jsx`, `DataManager.jsx` |
| Layout & Nav | `Sidebar.jsx`, `TopBar.jsx`, `AvatarMenu.jsx`, `Dashboard.jsx` |
| Theming | (toggle in `TopBar.jsx`, CSS variable usage) |
| Logging | `logger.js` |

---
Document version: 1.0 (Generated)
