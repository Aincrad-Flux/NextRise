# 🚀 JEB Startup Incubator Platform

[![Jenkins](https://img.shields.io/badge/Jenkins-D24939?logo=jenkins&logoColor=white)](#)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Contributors](https://img.shields.io/github/contributors/Aincrad-Flux/Survivor)](#)

A modern **Next.js + React** web platform built to showcase projects from the **JEB Startup Incubator**.
The platform connects startups, investors, and partners, while promoting innovation and collaboration through a dynamic, accessible, and user-friendly interface.

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)

    * [Public Area](#public-area)
    * [Startup Area](#startup-area)
    * [Admin Area](#admin-area)
3. [Tech Stack](#-tech-stack)
4. [Getting Started](#-getting-started)

    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Running Locally](#running-locally)
    * [Building for Production](#building-for-production)
5. [Docker & Docker Compose](#-docker--docker-compose)
6. [Project Structure](#-project-structure)
7. [Development Guidelines](#-development-guidelines)
8. [Design & UX](#-design--ux)
9. [Deployment](#-deployment)
10. [Contributing](#-contributing)
11. [License](#-license)

---

## 🌍 Overview

The JEB Startup Incubator platform is designed to:

* Provide **visibility** for startups and project leaders.
* Facilitate **connections** with investors, partners, and clients.
* Promote **innovation and collaboration** across the ecosystem.
* Offer **dynamic updates** on projects, fundraising, and events.

Target users include:

* Startups & alumni
* Investors and funders
* Potential partners & institutions
* Local authorities, general public, and media

---

## ✨ Features

### 🔓 Public Area

* **Homepage**: Introduction to the incubator + featured projects.
* **Project Catalog**: List of startups with descriptive profiles.
* **Project Pages**: Detailed project information (description, founders, needs, progress, social links).
* **News Feed**: Updates on fundraising, competitions, events.
* **Search & Filters**: By sector, maturity, and location.
* **Events Calendar**: Workshops, pitch sessions, and conferences.

### 🏗️ Startup Area

* **Profile Management**: Startups create and update their profiles.
* **Internal Messaging**: Communication between startups and investors.
* **Opportunities**: Access to calls for projects, funding, and partnerships.

### 🛠️ Admin Area

* **Dashboard**: Statistics on visibility and user interactions.
* **Content Management**: Add, edit, and delete project profiles.
* **User Management**: Role assignment (admin, startup, visitor).
* **Back Office Tools**: Manage startups, projects, and news.

---

## 🛠 Tech Stack

* **Frontend**: [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript]
* **Styling**: [Tailwind CSS](https://tailwindcss.com/), [ShadCN/UI](https://ui.shadcn.com/)
* **Backend**: Node.js + Express (or Next.js API Routes)
* **Database**: PostgreSQL / MySQL (via Prisma ORM)
* **Authentication**: NextAuth.js / JWT
* **API**: Migration from legacy incubator API → full CRUD system
* **Hosting**: Vercel / Docker

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/) (>= 18.x)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [PostgreSQL](https://www.postgresql.org/) (or chosen DB)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/jeb-incubator-platform.git

# Navigate into the project
cd jeb-incubator-platform

# Install dependencies
npm install
# or
yarn install
```

### Running Locally

```bash
# Start development server
npm run dev
```

Then visit: [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm run start
```

---

## 🐳 Docker & Docker Compose

This repository ships with a ready-to-use docker-compose.yml that starts three services:

- backend: Next.js dev server on port 3000
- frontend: Vite dev server on port 5173
- db: PostgreSQL 16 on port 5432 (with a persisted volume)

Hot reload is enabled via bind mounts for backend and frontend.

### Requirements

- Docker Desktop (or Docker Engine) and Docker Compose v2

### 1) Configure environment

Copy the example env file and adjust values as needed:

```bash
cp .env.example .env
```

Key variables (already referenced by docker-compose):

- POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- DATABASE_URL (e.g. postgresql://user:pass@db:5432/dbname)
- VITE_BACKEND_URL (for the Vite frontend → must start with VITE_)
- NEXT_PUBLIC_API_BASE (for the Next.js app, exposed to the browser)

Note: docker compose automatically loads the .env file at the repo root.

### 2) Start the stack

```bash
docker compose up -d --build
```

Access the services:

- Frontend (Vite): http://localhost:5173
- Backend (Next.js): http://localhost:3000
- Postgres: localhost:5432 (user/pass/db from .env)

### Useful commands

- Follow logs for a service:

  ```bash
  docker compose logs -f backend
  docker compose logs -f frontend
  docker compose logs -f db
  ```

- List containers / status:

  ```bash
  docker compose ps
  ```

- Stop / remove:

  ```bash
  docker compose stop
  docker compose down           # stop and remove containers
  docker compose down -v        # also remove the pg_data volume
  ```

- Rebuild a single service:

  ```bash
  docker compose build backend && docker compose up -d backend
  docker compose build frontend && docker compose up -d frontend
  ```

- Restart a service:

  ```bash
  docker compose restart frontend
  ```

- Connect to Postgres (psql inside the container):

  ```bash
  docker compose exec -it db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
  ```

### Notes

- If ports 3000/5173/5432 are already in use, change the host ports in docker-compose.yml.
- Prisma migrations aren’t required in this template unless you add Prisma; DATABASE_URL is provided for future use.
- Production images are supported by the Dockerfiles. See the commented notes at the bottom of docker-compose.yml to switch build targets to prod and adjust ports.

---

## 📂 Project Structure

```
/project-root
 ├── /app              # Next.js app directory (pages, layouts, API routes)
 ├── /components       # Reusable React components
 ├── /lib              # Utilities, helpers, API clients
 ├── /styles           # Tailwind and global styles
 ├── /prisma           # Prisma schema & migrations
 ├── /public           # Static assets
 ├── /tests            # Unit & integration tests
 ├── next.config.js    # Next.js configuration
 ├── tailwind.config.js
 └── package.json
```

---

## 👨‍💻 Development Guidelines

* Follow **component-driven development** with reusable UI blocks.
* Use **TypeScript** for type safety.
* Follow **Git branching** strategy (`main` → `develop` → `feature/*`).
* Ensure **accessibility** (WCAG compliance).
* Run `npm run lint && npm run test` before pushing changes.

---

## 🎨 Design & UX

* Modern, intuitive UI following incubator branding.
* **Responsive**: Works seamlessly on desktop, tablet, and mobile.
* **Accessible**: WCAG-compliant for inclusive usage.
* **Animations**: Subtle transitions for navigation and interactions.

---

## ☁️ Deployment

Recommended hosting:

* **Frontend**: [Vercel](https://vercel.com/) (native Next.js support).
* **Backend + DB**: [Render](https://render.com/), [Railway](https://railway.app/), or Dockerized VPS.

Deployment steps:

1. Configure environment variables (`.env`).
2. Run database migrations:

   ```bash
   npx prisma migrate deploy
   ```
3. Deploy frontend on Vercel or Docker.

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo.
2. Create a new branch (`feature/my-feature`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature/my-feature`).
5. Open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.