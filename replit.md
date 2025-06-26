# Internship Platform - InternHub

## Overview

InternHub is a full-stack web application that connects students with internship opportunities. Built with a modern TypeScript stack, it provides a comprehensive platform for students to discover internships, companies to post opportunities, and administrators to manage the ecosystem.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL sessions via connect-pg-simple
- **Password Security**: Node.js crypto module with scrypt hashing

### Database Architecture
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Schema Validation**: Zod for runtime type checking
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### User Management
- **Multi-role system**: Students, Companies, and Administrators
- **Profile management**: Skills, location, bio, and company information
- **Authentication**: Secure session-based login with encrypted passwords

### Internship System
- **Posting**: Companies can create and manage internship listings
- **Discovery**: Advanced search and filtering by location, skills, and type
- **Applications**: Students can apply with cover letters and resume links
- **Status Tracking**: Application status management (pending, reviewed, accepted, rejected)

### Content Management
- **Blog System**: Career advice, industry insights, and success stories
- **Categorization**: Organized content with tags and categories
- **Publishing**: Draft and published states for content

### Additional Features
- **Favorites System**: Students can bookmark internships
- **Admin Dashboard**: Platform statistics and user management
- **Responsive Design**: Mobile-first approach with adaptive layouts

## Data Flow

1. **Authentication Flow**: Users login via Passport.js, sessions stored in PostgreSQL
2. **Data Fetching**: React Query manages API calls with caching and invalidation
3. **Form Handling**: React Hook Form with Zod validation on both client and server
4. **Real-time Updates**: Optimistic updates with automatic cache invalidation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **bcryptjs**: Password hashing (backup to crypto module)
- **connect-pg-simple**: PostgreSQL session store
- **drizzle-orm**: Type-safe database queries
- **@tanstack/react-query**: Server state management

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-cartographer**: Development tooling for Replit

## Deployment Strategy

### Development
- **Environment**: Replit with Node.js 20, PostgreSQL 16
- **Hot Reload**: Vite dev server with HMR
- **Database**: Local PostgreSQL instance

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Autoscale deployment target on port 80
- **Database**: Production PostgreSQL via DATABASE_URL environment variable

### Environment Configuration
- **SESSION_SECRET**: Required for session encryption
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment detection (development/production)

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 26, 2025. Initial setup