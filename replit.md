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

## Recent Achievements (July 14, 2025)

### Simplified Company Signup + External Form Integration (Latest - July 14, 2025)
- ✅ **Complete Company Signup Redesign**: Simplified from 3-step form to simple email/password registration
- ✅ **External Google Form Integration**: After signup, automatically opens `https://forms.gle/2JHE82ZwarXYMGdE7` in new tab
- ✅ **Streamlined UX Flow**: Email/Password → Google Form (new tab) → Thank You Page (current tab)
- ✅ **Clear User Guidance**: Added blue info box explaining the next step with form preview link
- ✅ **Maintained Autofill Prevention**: All 10-step autofill prevention system still active on simplified form
- ✅ **Auto-redirect Logic**: Page automatically refreshes to thank you page after opening external form
- ✅ **Placeholder Data**: Company registration now uses placeholder names since detailed info collected externally

### Ultimate 10-Step Autofill Prevention System (Implemented - July 14, 2025)
- ✅ **Step 1**: Random field names - All inputs now use completely random 8-character alphanumeric names (e.g., `x9k4m7q2`, `p8w3n5t1`, `b2j6f9l3`)
- ✅ **Step 2**: Readonly-on-focus method - All inputs start readonly and remove attribute only on focus: `readOnly onFocus={(e) => e.target.removeAttribute('readonly')}`
- ✅ **Step 3**: Hidden dummy fields positioned off-screen with `position: absolute, top: -1000px, left: -1000px`
- ✅ **Step 4**: Aggressive JavaScript field clearing with `document.querySelectorAll("input").forEach(input => input.value = "")`
- ✅ **Step 5**: Window.onload method implemented for additional clearing on page load
- ✅ **Step 6**: All forms wrapped with `autoComplete="off"` to disable browser autofill
- ✅ **Step 7**: Disabled all autocomplete attributes changed to `autoComplete="off"`
- ✅ **Step 8**: Unique random IDs matching field names for complete consistency
- ✅ **Step 9**: Multiple clearing functions with `removeAttribute('value')` for thorough cleanup
- ✅ **Step 10**: Complete implementation across all major forms: Company Signup, Company Application, and Auth Page
- ✅ **Applied to**: All input fields, textarea fields, and select dropdowns across the platform
- ✅ **Testing ready**: Forms now use the most aggressive autofill prevention techniques available

### Production Deployment & Registration System Fixes (July 7, 2025)
- ✅ Fixed React state update warnings during registration
- ✅ Enhanced production deployment compatibility with proper port binding (0.0.0.0:5000)
- ✅ Improved authentication state management with requestAnimationFrame for proper render cycles
- ✅ Fixed "value.map is not a function" error completely through array field handling
- ✅ Streamlined registration to email-only (removed username requirement)
- ✅ Enhanced error handling for duplicate email registration with tab switching
- ✅ Backend registration confirmed working in both development and production
- ✅ Added proper Content-Type and Accept headers for production API compatibility
- ✅ Updated query client cache invalidation for better state consistency

### Student Registration System Overhaul (July 5-7, 2025)
- ✅ Completely removed username field from registration
- ✅ Multiple users can now have identical first/last names
- ✅ Simplified registration form to: First Name, Last Name, Email, Password only
- ✅ Fixed backend array field handling for skills, hobbies, interestedFields
- ✅ Enhanced email existence validation with clear user messaging
- ✅ Improved authentication flow with proper redirect handling

### Company Flow Redesign & Simplification (July 5, 2025)
- ✅ Changed landing page button from "Hire Talent" to "For Companies"
- ✅ Created new company info page (/company-info) with compelling copy:
  - "host an intern with intrn" headline
  - Student-run platform messaging
  - "smart, motivated high schoolers want to work with you" value proposition
  - Clear benefits: top students, no HR overhead, flexible arrangements
  - "you bring the project. we bring the talent." positioning
  - 3-step process visualization with numbered steps
  - "start your journey" call-to-action button
- ✅ Simplified company signup form from 5 steps to 3 steps:
  - Step 1: Basic Information (name, email, password, website)
  - Step 2: Company Details (contact info, location, description)
  - Step 3: Internship Program (work arrangement, duration, skills)
- ✅ Removed minimum 50-word requirement from company description
- ✅ Enabled free navigation between signup steps without validation blocking
- ✅ Only validates all fields on final submission
- ✅ Updated button flow: Landing → Company Info → Simplified Signup → Thank You

## Recent Achievements (July 4, 2025)

### Modern Purple Theme & UX Redesign (Latest - July 4, 2025)
- ✅ Complete purple theme implementation across entire platform
- ✅ Modern minimalist design approach replacing previous blue/gray theme
- ✅ Updated CSS variables: Primary purple (hsl(270, 95%, 60%)), gradient backgrounds, contemporary color scheme
- ✅ Redesigned landing page: Clean hero section, minimalist stats, simplified features grid
- ✅ Modern navigation: Glassmorphism header, purple gradients, rounded corners
- ✅ Updated authentication pages: Clean layouts, purple buttons, modern cards
- ✅ Corporate & student appeal: Professional yet approachable design language
- ✅ Fully responsive design with mobile-first approach
- ✅ Contemporary typography and spacing for better readability
- ✅ Tech-native language: "Code Your Future", "Start Building", "Ship Real Code", "Level Up Fast"
- ✅ Added high schooler icon before "For Highschoolers" text
- ✅ Updated headers from black to dark grey (hsl(240, 10%, 15%)) for softer appearance
- ✅ Changed stats language: "Active Builders", "Tech Companies", "Live Projects", "Ship Rate"

### Platform Polish & User Flow Improvements (Latest - July 4, 2025)
- ✅ Fixed font visibility: Changed dark grey text back to black throughout the site
- ✅ Created proper "i" logo to replace white box placeholder 
- ✅ Implemented blog access control: redirects non-logged users to signup
- ✅ Built company thank-you page with application status and blog access
- ✅ Streamlined student dashboard to four core sections: Blog, Browse Internships, Edit Profile, Previous Internships
- ✅ Created company status tracking page for application monitoring
- ✅ Updated company signup flow to redirect to thank-you page after submission

### Content & Language Simplification (Latest - July 4, 2025)
- ✅ Changed hero text from "Code Your Future" to "Internships for Highschoolers"
- ✅ Updated description to focus on meaningful learning experiences instead of tech-heavy language
- ✅ Simplified call-to-action button from "Start Building" to "Get Started"
- ✅ Removed tech jargon in favor of clear, accessible language for high school students
- ✅ Fixed logo consistency - changed navigation "I" to lowercase "i" to match branding
- ✅ Changed "For Highschoolers" text from purple to black for better readability
- ✅ Fixed all feature section icons from purple to black for better visibility
- ✅ Updated all text colors to black throughout landing page for maximum readability
- ✅ Simplified feature section content: "Gain Real Experience", "Learn New Skills", "Build Your Future"
- ✅ Removed all tech jargon from feature descriptions to be age-appropriate for high schoolers
- ✅ Fixed gradient text visibility: changed "intrn" logo, "Highschoolers", and "Future?" from gradient to solid black
- ✅ Replaced main logo black box with graduation cap icon for better visual appeal
- ✅ Removed "For Highschoolers" tagline from main logo area for cleaner design
- ✅ Updated footer background to light gray with black text for better readability

### High School Focus Customization
- ✅ Updated platform branding to "Internships for Highschoolers"
- ✅ Removed stipend/payment options - all internships are unpaid learning experiences
- ✅ Updated education levels to "8th Grade+", "10th Grade+", "12th Grade+"
- ✅ Emphasized learning experiences and skill development over compensation
- ✅ Removed salary field from internship database schema
- ✅ Updated company signup to highlight unpaid learning-focused internships
- ✅ Cleaned database: removed all 231 auto-generated fake internships
- ✅ Modified seed script to prevent future creation of fake internships
- ✅ Updated skills to be age-appropriate for high school students (9th/10th grade)
- ✅ Replaced advanced skills with beginner-friendly options: Social Media, Marketing, Design, Content Writing, Customer Service, Data Entry, Microsoft Office, Google Workspace, Photography, Video Editing, Canva Design
- ✅ Updated search filters with South Asian locations: Mumbai, Delhi, Bangalore, Chennai, Pune, Hyderabad, Kolkata, Ahmedabad, Dhaka, Karachi, Lahore, Colombo

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