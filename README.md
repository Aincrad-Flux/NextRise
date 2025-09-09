# 🚀 JEB Startup Incubator Platform

[![Jenkins](https://img.shields.io/badge/Jenkins-D24939?logo=jenkins&logoColor=white)](#)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributors](https://img.shields.io/github/contributors/Aincrad-Flux/Survivor)](#)

A modern **Next.js (API backend) + Vite/React (frontend)** platform highlighting projects from the **JEB incubator**.
It connects startups, investors and partners through a central place for visibility, collaboration and information.

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
  * Public
  * Startup
  * Admin
3. [Tech Stack](#-tech-stack)
4. [Quick Start](#-quick-start)
5. [Environment Variables](#-environment-variables)
6. [Project Structure](#-project-structure)
7. [Development Guidelines](#-development-guidelines)
8. [Design & UX](#-design--ux)
9. [Deployment](#-deployment)
10. [Contributing](#-contributing)
11. [License](#-license)

---

## 🌍 Overview

Core goals:

* Provide **visibility** for startups and founders.
* Enable **connections** (investors, partners, institutions).
* Surface **dynamic updates** (news, funding rounds, events).
* Centralize **opportunities** (funding, calls, collaborations).

Target users: startups & alumni, investors, partners, institutions, local authorities, media & public.

---

## ✨ Features

### 🔓 Public
* Landing page (incubator presentation + featured projects)
* Startup catalog (search + filters)
* Detailed project pages (description, needs, progress, links)
* News feed (events, funding, announcements)
* Filtering by sector / stage / location

### 🏗️ Startup
* Profile & visibility management
* Internal messaging (investors ↔ startups) [WIP]
* Access to opportunities (funding, challenges, partners)

### 🛠️ Admin
* User & role management (admin, startup, visitor)
* Content CRUD (startups, news, events)
* Analytics & insights (traffic, interactions) [roadmap]

---

## 🛠 Tech Stack

Backend (`backend/`):
* Next.js (App Router) – custom API routes (auth, incubator data)
* Custom auth (JWT + bcrypt)
* Supabase integration (storage / potential persistence)

Frontend (`frontend/`):
* Vite + React 19
* React Router
* Custom lightweight CSS components (Tailwind planned later)

Other: ESLint, multi-service environment (Docker section intentionally removed here)

---

## 🚀 Quick Start

Prerequisites: Node.js >= 18.

Clone the repository:
```bash
git clone <repo-url>
cd NextRise
```

Install backend & frontend dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

Run the backend (port 3000):
```bash
cd backend
npm run dev
```

Run the frontend in another terminal (port 5173):
```bash
cd frontend
npm run dev
```

Access:
* Frontend: http://localhost:5173
* Backend API: http://localhost:3000

---

## 🔐 Environment Variables

Backend (`backend/.env`) example:
```bash
SUPABASE_URL=... # Supabase instance URL
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
INCUBATOR_API_BASE_URL=https://api.jeb-incubator.com/
INCUBATOR_API_KEY=... # legacy incubator API key
VITE_BACKEND_URL=http://backend:3000
NEXT_PUBLIC_API_BASE=http://backend:3000
NODE_ENV=development
```

Frontend (`frontend/.env`):
```bash
VITE_BACKEND_URL=http://localhost:3000
```

Notes:
* Variables exposed to the browser must start with `NEXT_PUBLIC_` (Next.js) or `VITE_` (Vite).
* Never commit sensitive keys (e.g. Supabase service_role) to a public repo.

---

## 📂 Project Structure

```
root
├── backend/              # Next.js (API + potential future pages)
│   ├── src/app/api/...   # API routes
│   └── src/lib/          # Auth, db, incubator integrations
├── frontend/             # Vite + React (user interface)
│   ├── src/components/   # UI components
│   ├── src/pages/        # Views / pages
│   └── src/data/         # Mock / fixture data
├── doc/                  # openapi, style guide
└── README.md
```

---

## 👨‍💻 Development Guidelines

* Reusable components & clear separation.
* Lint: run `npm run lint` in both `backend` and `frontend`.
* Git flow: `dev` → `feature/<name>` → PR.
* Keep accessibility & performance in mind.
* Automated tests planned (roadmap).

---

## 🎨 Design & UX

* Clean, content-focused UI.
* Responsive (desktop & mobile).
* Planned improvements: dark mode, design tokens, micro-interactions.

---

## ☁️ Deployment

Options:
* Frontend: Vercel or Netlify
* Backend: Vercel (Edge/Node), Railway, Render
* Database: Supabase (managed PostgreSQL)

Generic steps:
1. Define environment variables on the target platform
2. Build & deploy (`build` then `start` backend / `build` frontend)
3. Validate main API endpoints (`/api/health`, auth, incubator data)

---

## 🤝 Contributing

1. Fork
2. Branch: `feature/<name>`
3. Conventional commits (example: feat(auth): add refresh token)
4. Open PR to `dev` (include description & screenshots for UI changes)
5. Review & merge

---

## 📜 License

Licensed under **MIT** – see `LICENSE`.

---

Questions or ideas? Open an issue or start a PR 🙌
