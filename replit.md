# InternHub - Compressed Replit.md

## Overview
InternHub is a full-stack web application designed to connect high school students with internship opportunities. The platform aims to provide a comprehensive ecosystem where students can discover and apply for internships, companies can post and manage opportunities, and administrators can oversee the entire system. It focuses on facilitating meaningful learning experiences for high schoolers, emphasizing skill development over compensation. The business vision is to become a leading platform for youth internships, fostering early career development and providing companies with access to motivated high school talent.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query)
- **UI Components**: Shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **UI/UX Decisions**: Modern minimalist design with a primary purple theme. Features include glassmorphism header, purple gradients, rounded corners, and a mobile-first approach. Typography and spacing are optimized for readability. Branding emphasizes "Internships for Highschoolers" with age-appropriate language and a graduation cap icon.

### Backend
- **Runtime**: Node.js with Express.js
- **Authentication**: Passport.js (local strategy, session-based)
- **Session Storage**: PostgreSQL sessions (connect-pg-simple)
- **Password Security**: Node.js crypto module (scrypt hashing)

### Database
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Schema Validation**: Zod
- **Migrations**: Drizzle Kit

### Key Features & Technical Implementations
- **User Management**: Multi-role system (Students, Companies, Administrators) with secure session-based authentication. Student onboarding includes fields for grade and school name. Admin can view detailed user profiles.
- **Internship System**: Companies can create and manage listings, with simplified signup redirecting to an external Google Form for detailed info. Students can search, filter, and apply for opportunities. Application status tracking is implemented. Internships are unpaid and learning-focused.
- **Content Management**: Blog system for career advice, accessible to all users.
- **Application Flow**: Students apply, and admins can view rich application data including student bio, cover letters, and company details.
- **Autofill Prevention**: Comprehensive 10-step system implemented across all forms using random field names, `readonly` attributes, hidden dummy fields, and JavaScript clearing methods.
- **Deployment**: Replit for development (Node.js 20, PostgreSQL 16), Vite for frontend production build, esbuild for backend production build.
- **Core Platform Features**: Student/Company profile management, CRUD for internships, advanced search/filtering, application system, favorites, admin dashboard with 6 management tabs (users, internships, applications, company requests, blog, statistics).
- **User Experience**: Professional, responsive design; smooth page transitions; enhanced search; student onboarding and company application flows.

## External Dependencies

### Core
- **@neondatabase/serverless**: Serverless PostgreSQL connection.
- **bcryptjs**: Password hashing (backup).
- **connect-pg-simple**: PostgreSQL session store.
- **drizzle-orm**: Type-safe database queries.
- **@tanstack/react-query**: Server state management.

### UI
- **@radix-ui/***: Accessible UI primitives.
- **tailwindcss**: Utility-first CSS framework.
- **class-variance-authority**: Type-safe component variants.
- **lucide-react**: Icon library.

### Development
- **tsx**: TypeScript execution for development.
- **esbuild**: Fast JavaScript bundler for production.