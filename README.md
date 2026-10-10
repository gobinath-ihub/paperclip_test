# FashionHub E-Commerce

A full-stack modern e-commerce platform built as an npm monorepo.

## Project Structure

This monorepo is managed using `npm workspaces`:

- **`apps/client`**: Frontend web application built with React, Vite, and Tailwind CSS.
- **`apps/server`**: Backend REST API server built with Node.js, Express, TypeScript, and Prisma ORM.
- **`packages/shared`**: Shared TypeScript types, interfaces, and utilities used across client and server.
- **`docs/`**: Technical architecture specifications, mockups, and integration design docs.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Lucide Icons, Axios
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** PostgreSQL
- **Shared:** TypeScript library (`@fashionhub/shared`)

## Database Models

- `User`: Authentication, roles (`USER`, `ADMIN`), country, profiles.
- `Product`: Product catalogue, pricing, category relation.
- `Category`: Categories for organizing products.
- `Cart` & `CartItem`: Shopping cart state per user.
- `Order` & `OrderItem`: Order management, items, total, status.
- `VatRate`: Country-specific VAT rates for regional pricing/taxation.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- PostgreSQL

### Installation

```bash
# Install all dependencies across workspaces
npm install
```

### Build

```bash
# Build all workspaces
npm run build
```

### Development

```bash
# Run backend server in dev mode
npm run dev --workspace=apps/server

# Run frontend client in dev mode
npm run dev --workspace=apps/client
```

### Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate --workspace=apps/server

# Run migrations (or push schema)
npx prisma db push --schema=apps/server/prisma/schema.prisma

# Seed database
npm run seed --workspace=apps/server
```
