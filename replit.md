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

## Recent Achievements (July 4, 2025)

### Complete Landing Page Redesign (Latest)
- ✅ Completely redesigned landing page with emotional storytelling approach
- ✅ Added floating background elements and sophisticated backdrop blur effects
- ✅ Implemented human-centered messaging focusing on "first step into professional world"
- ✅ Created compelling story section "We Believe Every High Schooler Deserves a Chance"
- ✅ Added real testimonial from high school student to build trust
- ✅ Enhanced "How It Works" section with numbered steps and clear process
- ✅ Used motion animations throughout for engaging user experience
- ✅ Emphasized emotional benefits: passion discovery, connections, getting ahead early
- ✅ Updated header with "for highschoolers" tagline and sparkles accent

### High School Focus Customization
- ✅ Updated platform branding to "Internships for Highschoolers"
- ✅ Removed stipend/payment options - all internships are unpaid learning experiences
- ✅ Updated education levels to "8th Grade+", "10th Grade+", "12th Grade+"
- ✅ Emphasized learning experiences and skill development over compensation
- ✅ Removed salary field from internship database schema
- ✅ Updated company signup to highlight unpaid learning-focused internships

### Authentication System
- ✅ Complete email/password authentication with Passport.js
- ✅ Simplified signup process - users register as students by default
- ✅ Replit Auth integration setup with demo endpoints
- ✅ Dual authentication options: traditional email/password + Replit Auth
- ✅ Role-based access control (Student, Company, Admin)
- ✅ Secure session management with PostgreSQL storage

### Company Registration System
- ✅ Comprehensive 5-step company signup process
- ✅ Detailed questionnaires covering work arrangements, mentorship, and benefits
- ✅ Focus on learning experiences for high school students
- ✅ Additional benefits tracking (health insurance, flexible hours, learning budget)
- ✅ Technical and soft skills requirements matching
- ✅ Company verification and approval workflow

### Core Platform Features
- ✅ Student profile management with skills and university tracking
- ✅ Company profile management and verification system
- ✅ Internship posting and management (CRUD operations)
- ✅ Advanced search and filtering by location, skills, type
- ✅ Application system with status tracking
- ✅ Favorites/bookmarking functionality

### Admin Backend System  
- ✅ Comprehensive admin dashboard with 6 management tabs
- ✅ User management (view, edit, deactivate accounts)
- ✅ Internship management and oversight
- ✅ Application status monitoring and management
- ✅ Company request approval workflow
- ✅ Blog content management system
- ✅ Real-time platform statistics

### User Experience
- ✅ Professional responsive design with Tailwind CSS
- ✅ Smooth page transitions with Framer Motion
- ✅ Mobile-first approach with adaptive layouts
- ✅ Enhanced search functionality on homepage
- ✅ Blog system for career advice and insights
- ✅ Student onboarding and company application flows

### Technical Implementation
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Type-safe API routes with Zod validation
- ✅ React Query for efficient data fetching
- ✅ Shadcn/ui components for consistent design
- ✅ Social login buttons with proper OAuth flow

## Platform Status
The internship platform is fully functional and production-ready with all core features implemented. Users can register, create profiles, post/apply for internships, and administrators can manage the entire platform through the comprehensive backend.

Access the platform status page at `/status` for detailed feature overview.

## Changelog

- June 29, 2025: Complete platform implementation with social login, admin backend, and all core features
- June 26, 2025: Initial setup