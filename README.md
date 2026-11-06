<div align="center">

# React, Supabase & Sanity Project

### Bilingual Business Website & Online Learning Platform

**A bilingual digital experience for a more sustainable global supply chain.**

[![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

</div>

Dieses Demo-Projekt zeigt eine zweisprachige Website für nachhaltige Entwicklung und internationale Handels-Compliance. Es verbindet klare Markenkommunikation mit Service-, Schulungs- und Verifizierungsfunktionen.

## Overview

This project is a bilingual (Chinese and English) website concept for a sustainability and international trade compliance consultancy. It combines public-facing service pages with a content-management workflow and a learner-facing online course platform.

## Highlights

- **Bilingual experience** — Chinese and English routes, localized page content, and language-aware navigation.
- **Sustainability services** — Forestry certification, climate and carbon management, circular economy, and ESG information.
- **Compliance resources** — EUDR and product-compliance information, plus a searchable verification-record experience.
- **Online learning** — Aliyun Video-on-Demand playback, authenticated course access, lesson progress tracking, exam submissions, instructor-reviewed scores and feedback, and certificate records.
- **Content management** — Sanity Studio for published site copy and verification records.
- **Database development** — Supabase PostgreSQL schema design for learner profiles, course progress, exam attempts, and certificates, with role-based access and Row Level Security (RLS) policies.
- **Authentication & operations** — Supabase Auth and Edge Functions for learner and administrator workflows, including invitation-based account management and Aliyun SMS delivery.
- **Responsive presentation** — A forest-inspired visual system, image-led storytelling, and considered motion across screen sizes.

## Built with

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, React Router |
| Styling & interaction | Tailwind CSS, Radix UI, Framer Motion |
| Build & prerendering | Vite, Bun |
| Content management | Sanity |
| Database, authentication & serverless functions | Supabase (PostgreSQL, Auth, Edge Functions, RLS) |
| Course video playback | Aliyun Video-on-Demand (Aliyun Player Web SDK) |
| Deployment | Cloudflare Pages |

## Run locally

### Requirements

- [Bun](https://bun.sh/) 1.4.4
- Node.js 20 or newer

```bash
git clone https://github.com/your-username/your-demo-repository.git
cd your-demo-repository
bun install --frozen-lockfile
bun run dev
```

The development server starts with the site's local configuration. To enable connected services, create a `.env.local` file and configure the variables described below. Keep private credentials out of version control.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_WEB3FORMS_ACCESS_KEY` | Contact form submissions |
| `VITE_SANITY_PROJECT_ID` | Sanity project used by the site and Studio |
| `VITE_SANITY_DATASET` | Sanity dataset (defaults to `production`) |
| `VITE_SUPABASE_URL` | Supabase project URL for course and learner features |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key |
| `VITE_ASSET_BASE_URL` | Optional base URL for remotely hosted `/assets/*` files |

Only use browser-safe publishable keys for `VITE_` variables. Never expose a Supabase service-role key or a Sanity write token in client-side configuration. See [DEPLOY.md](./DEPLOY.md) for service setup and deployment details.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Vite development server |
| `bun run build` | Build and prerender the production site |
| `bun run preview` | Preview the production build locally |
| `bun run type-check` | Run the TypeScript compiler without emitting files |
| `bun run lint` | Lint the project with Biome |
| `bun run sanity:seed-public-copy --dry-run` | Preview the Sanity public-copy seed operation |

## Project structure

```text
src/
├── components/   Shared UI, navigation, and generated page sections
├── data/         Site content, navigation, banners, and showcase images
├── pages/        Home, services, online courses, verification, and contact routes
├── sanity/       Sanity client, schemas, and public-copy integration
├── lib/          Shared utilities and service clients
└── routes.tsx    Chinese and English route definitions
functions/        Cloudflare Pages API functions
supabase/         Edge functions and database migrations
scripts/          Build-time prerendering and content utilities
```

### Course and database workflows

- Students authenticate and access course content through Supabase Auth.
- Course lessons are delivered with the Aliyun Player Web SDK and Aliyun VOD-hosted video.
- Lesson completion and exam submissions are stored in Supabase; administrators can review submissions, assign scores, and provide feedback.
- Certificate records are associated with learners and courses.
- Row Level Security policies separate student access from administrator workflows.

## Deployment

The site is built as a static Vite application and deployed to Cloudflare Pages. The build command is `bun run build`, and the output directory is `dist`. Configure the relevant environment variables for both Preview and Production deployments.

For detailed Cloudflare Pages, Sanity, Supabase, and course-platform setup, see the [deployment guide](./DEPLOY.md).

---

<div align="center">

Portfolio demo — built to explore sustainable trade, full-stack data workflows, and online learning.

</div>
