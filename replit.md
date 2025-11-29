# BCLOG Warehouse Management System

## Overview

BCLOG is an internal warehouse management system for tracking inventory in a porta-palete (pallet rack) storage facility and a Kanban-based rapid dispatch area. The system provides a web interface for warehouse staff to manage product locations across two warehouse blocks (each with 5 levels and 2 positions per level, totaling 20 positions per block) and track products moving through a three-stage Kanban workflow (Green/Yellow/Red) for fast-moving items.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, designed for internal collaborative use with real-time inventory visibility and simple product management workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing (single-page application)

**UI Component System**
- shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Material Design principles with Tailwind CSS for utility-first styling
- Roboto font family from Google Fonts for consistent typography
- Custom design tokens defined in CSS variables for theming (light mode only)

**State Management**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Local React state (useState) for UI-specific state like modal visibility and form state
- React Hook Form with Zod validation for form handling and validation

**Key Design Patterns**
- Component composition with separation of presentational and container components
- Modal-based workflows for adding/editing products with confirmation dialogs for destructive actions
- Responsive layout with mobile-first approach using Tailwind breakpoints
- Toast notifications for user feedback on CRUD operations

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for RESTful API endpoints
- HTTP server created with Node's built-in `http` module for WebSocket compatibility (if needed later)
- Custom request logging middleware for monitoring API usage and performance

**API Design**
- RESTful endpoints following resource-oriented patterns:
  - `GET /api/positions` - Fetch all pallet positions
  - `PATCH /api/positions/:id` - Update position with product data
  - `DELETE /api/positions/:id` - Clear a position
  - `GET /api/kanban` - Fetch all Kanban pallets
  - `POST /api/kanban` - Create new Kanban pallet
  - `PATCH /api/kanban/:id` - Update Kanban pallet (including status changes)
  - `DELETE /api/kanban/:id` - Remove Kanban pallet
  - `GET /api/stats` - Fetch dashboard statistics
- Zod schema validation on incoming request bodies to ensure data integrity
- JSON response format for all API endpoints

**Data Storage**
- In-memory storage implementation (`MemStorage` class) for development/demo purposes
- Interface-based storage abstraction (`IStorage`) allowing future migration to database persistence
- Pre-initialized warehouse structure (2 blocks × 5 levels × 2 positions = 20 positions per block)

**Schema & Validation**
- Shared TypeScript types between client and server via `@shared/schema.ts`
- Zod schemas for runtime validation and type inference:
  - `palletPositionSchema` - Warehouse position with optional product data
  - `kanbanPalletSchema` - Kanban pallet with required product data and status
  - `productFormSchema` - Form validation for product input
- Type safety enforced through TypeScript compilation and runtime Zod validation

### Application Structure

**Directory Organization**
- `/client` - React frontend application
  - `/src/components` - Reusable UI components (cards, modals, forms)
  - `/src/pages` - Page-level components (home dashboard, 404)
  - `/src/lib` - Utility functions and shared configuration
  - `/src/hooks` - Custom React hooks
- `/server` - Express backend application
  - `routes.ts` - API route definitions
  - `storage.ts` - Data persistence layer abstraction
  - `static.ts` - Static file serving configuration
- `/shared` - Code shared between client and server
  - `schema.ts` - Zod schemas and TypeScript types

**Build & Deployment**
- Development: Vite dev server with HMR for frontend, tsx for running TypeScript backend
- Production: esbuild bundles server code, Vite builds optimized client bundle
- Static assets served from `/dist/public` in production
- Build script (`script/build.ts`) orchestrates both client and server builds

### Key Features Implementation

**Warehouse Porta-Palete Management**
- Two-block grid layout displaying all 40 positions (20 per block)
- Visual distinction between empty positions (dashed borders, add prompt) and occupied positions (product details)
- Position cards show product name, code, quantity, and entry date
- Hover interactions reveal action buttons (view, edit, clear)
- Click-to-add workflow for empty positions
- Confirmation dialog before clearing positions to prevent accidental data loss

**Kanban Rapid Dispatch System**
- Three-column layout for Green (Available), Yellow (Pre-dispatch), and Red (Urgent) statuses
- Color-coded headers and visual indicators for each status level
- Drag-free workflow using explicit move buttons between columns
- "Mark as Expedited" action for Red column items to remove from system
- Scrollable columns to handle varying numbers of pallets per status

**Dashboard Statistics**
- Real-time metrics displayed in header:
  - Total occupied positions across both blocks
  - Free positions available
  - Kanban pallet counts by status (Green/Yellow/Red)
- Automatic recalculation on any data mutation via React Query cache invalidation

**Responsive Design**
- Mobile-friendly tab-based navigation between Warehouse and Kanban sections
- Desktop shows both sections simultaneously with grid layouts
- Touch-optimized action buttons and form controls
- Adaptive spacing and typography based on viewport size

## External Dependencies

**Core Framework Dependencies**
- `react` & `react-dom` - UI framework
- `express` - Backend web server
- `vite` - Build tool and dev server
- `typescript` - Type system
- `wouter` - Client-side routing

**UI Component Libraries**
- `@radix-ui/*` - Headless accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- `tailwindcss` - Utility-first CSS framework
- `lucide-react` - Icon library

**Data Management**
- `@tanstack/react-query` - Server state management and caching
- `react-hook-form` - Form state and validation
- `zod` - Schema validation library
- `@hookform/resolvers` - Integration between react-hook-form and Zod
- `drizzle-orm` - SQL ORM (prepared for future database integration)
- `drizzle-zod` - Zod schema generation from Drizzle schemas

**Database (Prepared, Not Yet Implemented)**
- `@neondatabase/serverless` - Neon Postgres serverless driver
- `drizzle-kit` - Database migration tool
- PostgreSQL dialect configured in `drizzle.config.ts`

**Utilities**
- `date-fns` - Date formatting and manipulation
- `clsx` & `tailwind-merge` - Conditional className utilities
- `class-variance-authority` - Component variant styling
- `nanoid` - Unique ID generation

**Development Tools**
- `@replit/*` plugins - Replit-specific development enhancements
- `esbuild` - Fast JavaScript bundler for production builds
- `tsx` - TypeScript execution for development server

**Type Definitions**
- `@types/node` - Node.js type definitions
- `vite/client` - Vite client type definitions