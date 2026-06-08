# FashionHub E-Commerce Technical Architecture

This project is a high-quality e-commerce platform built with a modern monorepo architecture.

## Tech Stack
- **Monorepo:** npm workspaces
- **Frontend:** React + Vite (TypeScript)
- **Backend:** Node.js + Express (TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Shared:** `@fashionhub/shared` for cross-package types and utilities

## Project Structure
- `apps/client`: Frontend application
- `apps/server`: Backend API
- `packages/shared`: Shared TypeScript types and business logic
- `docs/mockups`: Approved UX designs (HTML/CSS)

## Development Standards
- **TypeScript:** Strict mode enabled.
- **Linting:** ESLint with recommended TypeScript and React rules.
- **Formatting:** Prettier for consistent code style.
- **Database:** Prisma Client should be used for all DB interactions.

## Workflows
- `npm run dev`: Starts all workspace dev servers.
- `npm run build`: Builds all workspaces.
- `npm run lint`: Runs linting across the monorepo.
- `npm run format`: Formats all files with Prettier.
