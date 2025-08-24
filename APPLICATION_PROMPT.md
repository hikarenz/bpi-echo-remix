# VendorPro - Comprehensive Vendor Management Platform

## Application Overview

VendorPro is a professional, enterprise-grade vendor lifecycle management platform built with React, TypeScript, Tailwind CSS, and Supabase. The application features a sophisticated dark theme with glossy, modern design elements and comprehensive vendor management capabilities.

## Core Features & Architecture

### 1. Authentication & Role Management
- **Multi-role authentication system** with Supabase Auth
- **Role-based routing** with guards for different user types
- **User roles**: BPI Admins, Vendors
- **Automatic redirects** based on user role and profile completion status
- **Secure session management** with real-time auth state updates

### 2. Vendor Management System
- **Complete vendor lifecycle management** from application to renewal
- **Multi-stage onboarding process** with profile completion tracking
- **Status-based vendor workflows** (pending, active, suspended, etc.)
- **Document management** with file uploads and compliance tracking
- **Vendor application portal** with interactive forms and status updates

### 3. Dashboard & Analytics
- **Interactive dashboard** with real-time metrics and charts
- **Vendor performance analytics** with trend visualization using Recharts
- **Status cards** with dynamic counts and visual indicators
- **Recent activity feeds** with timestamped events
- **Responsive data visualization** with smooth animations

### 4. User Interface Design System

#### Visual Design
- **Professional dark theme** as default with sophisticated color palette
- **Glossy card design** with gradient backgrounds and backdrop blur effects
- **Modern glass morphism** with subtle transparency and shadows
- **Gradient text effects** and primary color highlights in green (#34D399)
- **Smooth animations** and hover effects throughout the interface

#### Component Architecture
- **Shadcn/ui component library** as foundation with custom styling
- **Design token system** with semantic color variables in HSL format
- **Consistent spacing** and typography using Inter font family
- **Responsive design** with mobile-first approach
- **Accessibility-focused** components with proper ARIA labels

### 5. Technical Architecture

#### Frontend Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing with nested layouts
- **TanStack Query** for server state management and caching
- **React Hook Form** with Zod validation for forms
- **Tailwind CSS** with custom design system

#### Backend Integration
- **Supabase** for backend services (database, auth, storage)
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live data updates
- **Edge functions** for server-side logic
- **File storage** with secure upload capabilities

### 6. Key Pages & Workflows

#### Admin Dashboard (`/dashboard`)
- Overview metrics with vendor counts and status distributions
- Interactive charts showing vendor trends and performance
- Recent activity feed with vendor status changes
- Quick access to vendor management functions

#### Vendor Management (`/manage-vendors`)
- Comprehensive vendor directory with search and filtering
- Vendor status management with bulk operations
- Individual vendor profile views with complete history
- Invitation system for new vendor onboarding

#### Vendor Portal (`/vendors`)
- Self-service vendor dashboard with status overview
- Profile completion workflow with progress tracking
- Document upload and compliance management
- Renewal process with automated reminders

#### Evaluation System (`/evaluation`)
- Structured vendor assessment forms
- Multi-criteria evaluation with scoring
- Progress tracking and completion status
- Results visualization and reporting

### 7. Design System Specifications

#### Color Palette (HSL Format)
```css
/* Primary Colors */
--primary: 142 76% 36% (Green)
--background: 220 13% 9% (Dark Blue-Gray)
--foreground: 220 9% 98% (Light Gray)

/* Card System */
--card: 220 13% 11%
--card-hover: 220 13% 13%

/* Status Colors */
--success: 142 76% 36%
--warning: 48 96% 53%
--destructive: 0 84% 60%
--info: 217 91% 60%
```

#### Typography
- **Primary Font**: Inter (300, 400, 500, 600, 700 weights)
- **Headings**: Semibold with tight letter spacing
- **Body Text**: Regular weight with optimized line height
- **Gradient Text**: Primary gradient for emphasis

#### Component Variants
- **Glossy Cards**: Gradient backgrounds with subtle transparency
- **Glass Navigation**: Backdrop blur with border accents
- **Modern Buttons**: Gradient backgrounds with shadow effects
- **Enhanced Forms**: Glossy inputs with focus states

### 8. Key Components & Patterns

#### Layout Components
- `DashboardLayout`: Main admin interface with sidebar and top navigation
- `VendorLayout`: Vendor-specific interface with hamburger menu
- `ManageVendorsLayout`: Specialized layout for vendor management
- `AuthGuard`: Route protection based on authentication status
- `AdminGuard`: Role-based access control for admin functions

#### UI Components
- `Card`: Glossy card variants with gradient backgrounds
- `Button`: Enhanced with gradient backgrounds and hover effects
- `Input/Select/Textarea`: Modern form controls with glass effects
- `StatCard`: Dashboard metrics with icon and trend indicators
- `TrendChart`: Interactive charts with smooth animations

#### Business Logic Components
- `VendorApplicationPortal`: Complete vendor application workflow
- `VendorProfileCompletion`: Multi-step profile completion process
- `Evaluation`: Assessment forms with progress tracking
- `OnboardingGuard`: Conditional routing based on completion status

### 9. Performance & Optimization

#### Code Splitting
- Route-based code splitting for optimal loading
- Lazy loading of non-critical components
- Optimized bundle sizes with tree shaking

#### Caching Strategy
- TanStack Query for server state caching
- Optimistic updates for improved UX
- Background data synchronization

#### Responsive Design
- Mobile-first design approach
- Flexible grid systems with CSS Grid and Flexbox
- Adaptive navigation patterns

### 10. Development Guidelines

#### Code Organization
- Feature-based folder structure
- Reusable hooks for business logic
- Consistent naming conventions
- TypeScript strict mode enabled

#### Styling Approach
- Utility-first with Tailwind CSS
- Custom CSS for complex animations
- Design token system for consistency
- No inline styles for maintainability

#### State Management
- Local state with useState/useReducer
- Server state with TanStack Query
- Global auth state with Context API
- Form state with React Hook Form

## Implementation Notes

### Security Considerations
- Row Level Security (RLS) policies for all data access
- Authentication guards on all protected routes
- Input validation with Zod schemas
- Secure file upload with type validation

### Accessibility Features
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader optimization
- Color contrast compliance

### Performance Metrics
- Lighthouse score optimization
- Core Web Vitals compliance
- Fast initial page load
- Smooth animations at 60fps

This comprehensive platform provides a complete vendor management solution with enterprise-grade features, modern design, and robust technical architecture.