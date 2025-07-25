# Biconomy Explorer

## Overview

This is a modern web application that serves as a blockchain explorer for the Biconomy Network. The application allows users to search for and view detailed information about blockchain transactions, user operations, and payment details through an intuitive interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM (configured but using Neon serverless)
- **Storage**: In-memory storage implementation with interface for future database integration

### Key Design Decisions
- **Monorepo Structure**: Frontend (`client/`), backend (`server/`), and shared code (`shared/`) in single repository
- **API-First Approach**: Direct integration with Biconomy Network API rather than proxy through backend
- **Component-Based UI**: Extensive use of Radix UI primitives with custom styling
- **Type Safety**: Zod schemas for runtime validation and TypeScript interfaces

## Key Components

### Frontend Components
- **HashSearch**: Search interface with validation for blockchain hashes
- **HashOverview**: Displays high-level transaction information
- **PaymentInfo**: Shows payment and fee details with visual cards
- **UserOperations**: Expandable list of user operations with detailed information
- **UI Components**: Comprehensive shadcn/ui component library

### Backend Services
- **Express Server**: Minimal API server with middleware for logging and error handling
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Vite Integration**: Development server integration for hot module replacement

### Shared Resources
- **Schema Definitions**: Zod schemas for payment info, user operations, and hash details
- **Type Definitions**: Shared TypeScript interfaces across frontend and backend

## Data Flow

1. **User Input**: User enters transaction hash in search component
2. **Validation**: Client-side validation using Zod schemas and format checking
3. **API Request**: Direct fetch to Biconomy Network API (`https://network.biconomy.io`)
4. **Data Processing**: Response parsed and validated against shared schemas
5. **UI Rendering**: Components render formatted data with copy-to-clipboard functionality
6. **State Management**: React Query handles caching, loading states, and error handling

## External Dependencies

### Core Technologies
- **Biconomy Network API**: Primary data source for blockchain information
- **Neon Database**: Serverless PostgreSQL (configured but not actively used)
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: Production bundling for server code
- **Drizzle**: Database ORM and migration tool
- **TypeScript**: Type checking and compilation

### Authentication & Security
- API key authentication for Biconomy Network requests
- No user authentication currently implemented
- Basic input validation and sanitization

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds client code to `dist/public/` (development) / `dist/` (production)
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory
- **Production Build**: Use `node build.js` to build with proper file organization for deployment

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `BICONOMY_API_KEY`: API key for Biconomy Network access
- `NODE_ENV`: Environment specification (development/production)

### Production Setup
1. Install dependencies with `npm install`
2. Build application with `node build.js` (ensures correct file placement)
3. Run database migrations with `npm run db:push`
4. Start production server with `npm start`

**Note**: The custom build script (`build.js`) is required for deployment as it moves files from `dist/public/` to `dist/` to match deployment platform expectations.

### Development Workflow
- Hot reload enabled through Vite middleware
- TypeScript checking with `npm run check`
- Database schema changes via Drizzle push commands

The application is designed to be easily deployable on platforms like Replit, Vercel, or traditional VPS with minimal configuration required.

## Recent Changes

- Fixed search input alignment with proper vertical centering of icon and button
- Enhanced payment method to fetch real token information from Biconomy /info endpoint with fallback icons for tokens without assets
- Reorganized payment layout to display chain information under token symbol
- Created Network Status page with real-time health monitoring, collapsible chains, and table-formatted module status
- Merged navigation into explorer pages for unified user experience with inline navigation between Explorer and Network Status
- Added local storage search history functionality with Recent Searches section on explorer page
- Implemented history management with individual item removal and clear all functionality
- Added timestamp formatting for search history items (Just now, hours ago, date format)
- Enhanced payment token display with viem integration for accurate blockchain data
- Added token address display with blockchain explorer links in expandable fees section
- Integrated viem for dynamic token name fetching from supported chains (Ethereum, Base, Polygon, Arbitrum, Optimism, BSC)
- Added native token support using viem to fetch chain-specific native currency information
- Enhanced UI to distinguish between native tokens (0x0 address) and ERC-20 tokens
- Fixed fee display formatting to show "Not available" instead of "$Not available"
- Added Sonic chain support (64165) with proper native token detection and explorer links
- Clarified token detection logic: native tokens use chain.nativeCurrency.name, ERC-20 tokens use contract calls
- Fixed deployment build configuration by creating custom build script (build.js) that moves files from dist/public/ to dist/ for proper deployment structure
- Unified navbar design across all pages (Explorer, Network Status, Details) with consistent glass-card styling, compact layout, and uppercase navigation text
- Standardized table layouts in expanded views with consistent column widths (w-48 for labels) and right-aligned values across all sections
- Fixed Transaction Hash field formatting to match other table rows with proper typography and alignment
- Enhanced footer with additional bottom padding (pb-16) across all pages for better visual separation
- Redesigned network info page with compact 3x3 grid layout for desktop view showing supported chains
- Optimized chain cards to be more compact with reduced padding, smaller icons (8x8), and streamlined status indicators
- Removed chain ID display and added text truncation to prevent overflow in compact cards
- Fixed SPA routing for static hosting by adding _redirects and 404.html files to handle direct links
- Updated build script to automatically create SPA routing files during deployment builds
- Project is ready for static build and publishing with proper routing support
- Implemented auto-refresh functionality for pending UserOperations with 300ms polling interval
- Added visual feedback for pending operations: animate-pulse effect on entire operation cards and spinning loader icons
- Enhanced user experience with real-time status updates and clear visual indicators during operation processing
- Redesigned entire UI from border-based to gradient-based card system with 6 different gradient styles
- Created flat design approach without shadows while maintaining color gradients for visual separation
- Added comprehensive gradient card classes (primary, secondary, accent, warning, success, subtle) for different content types
- Updated all major components (HashOverview, PaymentInfo, UserOperations) to use gradient cards with appropriate color themes
- Enhanced root cards with glass-morphism effect: subtle gray borders, 95% transparency, and 12px backdrop blur for modern appearance
- Implemented professional typography system: Inter font for UI elements, JetBrains Mono for code/data, with optimized font features and tabular numbers for metrics
- Updated root card titles to use smaller, uppercase styling with letter tracking for improved visual hierarchy