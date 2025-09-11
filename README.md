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

- [🚀 JEB Startup Incubator Platform](#-jeb-startup-incubator-platform)
  - [📖 Table of Contents](#-table-of-contents)
  - [🌍 Overview](#-overview)
  - [✨ Features](#-features)
    - [🔓 Public](#-public)
    - [🏗️ Startup](#️-startup)
    - [🛠️ Admin](#️-admin)
  - [🛠 Tech Stack](#-tech-stack)
  - [🚀 Quick Start](#-quick-start)
  - [🔐 Environment Variables](#-environment-variables)
  - [📂 Project Structure](#-project-structure)
  - [👨‍💻 Development Guidelines](#-development-guidelines)
  - [🎨 Design \& UX](#-design--ux)
  - [☁️ Deployment](#️-deployment)
  - [🤝 Contributing](#-contributing)
  - [📜 License](#-license)

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

---

### 🔐 Auth cookie persistence

Le backend émet un cookie HttpOnly `auth_token` (JWT). Par défaut l'attribut `Secure` n'est appliqué qu'en production (`NODE_ENV=production`).

Pourquoi ? Un cookie `Secure` est ignoré par le navigateur si vous servez le backend via `http://` en local, ce qui casserait la persistance de session (obligeant l'utilisateur à se reconnecter à chaque refresh / navigation).

Variable d'environnement de contrôle :

* `COOKIE_SECURE=true`  → toujours ajouter `Secure` (requiert HTTPS sinon le cookie est rejeté)
* `COOKIE_SECURE=false` → ne jamais ajouter `Secure` (à éviter en prod)
* non défini            → comportement automatique (Secure seulement en prod)

Côté frontend assurez-vous d'utiliser `credentials: 'include'` dans `fetch` et de faire correspondre l'origine (http://localhost:5173) dans `ALLOWED_ORIGINS` pour que le cookie soit envoyé.

Pour vérifier : ouvrez l'onglet Application > Cookies après un login réussi ; vous devez voir `auth_token` persistant (Max-Age ≈ 7 jours).

5. Review & merge

---

## 📜 License

Licensed under **MIT** – see `LICENSE`.

---

Questions or ideas? Open an issue or start a PR 🙌
