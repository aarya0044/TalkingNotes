# Talking Notes

## Overview

Talking Notes is a full-stack web application built for emotional support and creative expression. It combines note-taking, poetry writing, and an empathetic chat console into a unified platform. The application provides a safe space for users to express their thoughts and feelings through writing while receiving comforting responses from an AI companion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**UI System**: Built with shadcn/ui components library on top of Radix UI primitives, styled with Tailwind CSS. The design features a soft, pastel color scheme optimized for emotional comfort.

**State Management**: Uses TanStack Query (React Query) for server state management, providing caching, synchronization, and optimistic updates for API interactions.

**Routing**: Implements client-side routing with Wouter for lightweight navigation between pages.

**Component Structure**: 
- Tabbed interface with three main sections: Notes, Poems, and Console
- Reusable UI components following atomic design principles
- Real-time typing indicators and auto-save functionality for notes

### Backend Architecture

**Runtime**: Node.js with Express.js framework for HTTP server and API routing.

**API Design**: RESTful API endpoints for CRUD operations on notes, poems, and chat messages.

**Session Management**: Uses express-session with PostgreSQL session store for user state persistence.

**Response System**: Built-in empathetic response generator that analyzes user messages and provides contextually appropriate comforting responses.

### Data Storage Solutions

**Database**: PostgreSQL as the primary database, configured through Drizzle ORM.

**Schema Design**: Three main entities - notes, poems, and chat messages, each with UUID primary keys and timestamp tracking.

**Migration System**: Uses Drizzle Kit for database schema migrations and type-safe database operations.

**Fallback Storage**: In-memory storage implementation for development and testing environments.

### Authentication and Authorization

**Current State**: No authentication system implemented - the application operates in a single-user mode.

**Session Management**: Basic session handling for maintaining state across requests.

### External Dependencies

**Database Hosting**: Neon Database serverless PostgreSQL for cloud database hosting.

**UI Components**: Comprehensive component library including forms, dialogs, tooltips, and data visualization components.

**Development Tools**: 
- Vite for fast development and hot module replacement
- TypeScript for type safety
- ESBuild for production builds
- PostCSS and Autoprefixer for CSS processing

**Styling**: Tailwind CSS with custom design tokens and CSS variables for theme management.

**Real-time Features**: Client-side polling for chat messages and automatic scroll-to-bottom functionality.