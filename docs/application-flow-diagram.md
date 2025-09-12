# VendorPro Application Flow Diagram

This comprehensive diagram shows the complete flow of the VendorPro application, including authentication, role-based routing, user workflows, and AI-powered features.

```mermaid
graph TD
    A[App Start] --> B{User Authenticated?}
    
    B -->|No| C[Auth Page]
    C --> D{Sign In/Sign Up}
    D --> E[AuthProvider validates]
    E --> F{Auth Success?}
    F -->|No| C
    F -->|Yes| G[RoleBasedRouter]
    
    B -->|Yes| G
    
    G --> H{Fetch User Role}
    H --> I{Role Type?}
    
    I -->|bpi_admin| J[Admin Flow]
    I -->|vendor| K[Vendor Flow]
    
    %% Admin Flow
    J --> L[AdminGuard Check]
    L --> M{On Vendor Routes?}
    M -->|Yes| N[Redirect to Admin Dashboard]
    M -->|No| O[DashboardLayout]
    
    O --> P[Dashboard]
    O --> Q[Manage Vendors]
    O --> R[Evaluation]
    O --> S[Add Vendor]
    O --> T[Remove Vendor]
    O --> AI[Echo AI Advisor]
    O --> FO[Features Overview]
    
    Q --> U[ManageVendorsLayout]
    U --> V[Vendor List by Status]
    U --> W[Status-based Actions]
    U --> X1[Bulk Operations]
    U --> Y1[Invitation Management]
    
    %% AI Advisor Features
    AI --> AI1[Vendor Selection Analysis]
    AI --> AI2[Ecosystem Optimization]
    AI --> AI3[Compliance Assessment]
    AI1 --> AI4[AI Response Generation]
    AI2 --> AI4
    AI3 --> AI4
    AI4 --> AI5[Vendor Recommendations]
    AI4 --> AI6[Risk Assessment]
    AI4 --> AI7[Action Items]
    
    %% Evaluation System
    R --> R1[Assessment Forms]
    R --> R2[Scoring System]
    R --> R3[Progress Tracking]
    R1 --> R4[Results Visualization]
    R2 --> R4
    R3 --> R4
    
    %% Vendor Flow
    K --> X{Vendor Company Linked?}
    X -->|No| Y[Basic Vendor Portal]
    X -->|Yes| Z{Profile Submitted?}
    
    Z -->|No| AA[VendorProfileCompletion]
    Z -->|Yes| BB{Company Status?}
    
    BB -->|pending| CC[VendorOnboarding]
    BB -->|approved| DD[VendorActiveManagement]
    BB -->|active| EE[Full Vendor Portal]
    BB -->|restricted| FF[Limited Access]
    BB -->|rejected| GG[Application Portal]
    
    %% Vendor Portal Routes
    EE --> HH[VendorLayout]
    HH --> II[Vendor Dashboard]
    HH --> JJ[Vendor Renewal]
    HH --> KK[Document Management]
    HH --> LL1[Profile Management]
    HH --> MM1[Compliance Tracking]
    
    %% Vendor Onboarding Process
    AA --> AA1[Company Information]
    AA --> AA2[Financial Details]
    AA --> AA3[Compliance Documents]
    AA --> AA4[References]
    AA1 --> AA5[Profile Submission]
    AA2 --> AA5
    AA3 --> AA5
    AA4 --> AA5
    
    %% Document Management
    KK --> KK1[Upload Documents]
    KK --> KK2[View Status]
    KK --> KK3[Download Copies]
    KK --> KK4[Version Control]
    
    %% Guards and Protections
    AA --> LL[OnboardingGuard]
    CC --> LL
    DD --> LL
    
    %% Auth Protection
    O --> MM[AuthGuard]
    HH --> MM
    U --> MM
    AI --> MM
    R --> MM
    
    %% Dashboard Analytics
    P --> P1[KPI Metrics]
    P --> P2[Performance Charts]
    P --> P3[Activity Feed]
    P --> P4[Risk Alerts]
    P1 --> P5[Real-time Updates]
    P2 --> P5
    P3 --> P5
    P4 --> P5
    
    %% Special Cases
    NN[Not Found] --> OO[404 Page]
    PP[Features Overview] --> PP1[Feature Categories]
    PP --> PP2[Technical Highlights]
    PP --> PP3[Workflow Navigation]
    
    %% Styling
    classDef authFlow fill:#e1f5fe
    classDef adminFlow fill:#f3e5f5
    classDef vendorFlow fill:#e8f5e8
    classDef guardFlow fill:#fff3e0
    classDef aiFlow fill:#fff9c4
    classDef dashboardFlow fill:#f0f4ff
    
    class C,D,E,F,G,H authFlow
    class J,L,M,N,O,P,Q,R,S,T,U,V,W,X1,Y1,FO,PP,PP1,PP2,PP3 adminFlow
    class K,X,Y,Z,AA,BB,CC,DD,EE,FF,GG,HH,II,JJ,KK,LL1,MM1,AA1,AA2,AA3,AA4,AA5,KK1,KK2,KK3,KK4 vendorFlow
    class LL,MM guardFlow
    class AI,AI1,AI2,AI3,AI4,AI5,AI6,AI7 aiFlow
    class P1,P2,P3,P4,P5,R1,R2,R3,R4 dashboardFlow
```

## Flow Description

### Authentication Flow (Light Blue)
- Initial authentication check and login/signup process
- Role determination and routing setup
- Session management and token refresh

### Admin Flow (Light Purple)
- BPI Admin dashboard with comprehensive analytics
- Vendor management with status-based organization
- Access to evaluation, vendor addition/removal
- Echo AI Advisor for intelligent decision making
- Features overview and system navigation

### Vendor Flow (Light Green)  
- Multi-stage vendor onboarding process
- Status-dependent access levels and capabilities
- Profile completion and renewal workflows
- Document management and compliance tracking
- Self-service portal with dashboard overview

### Guard Flow (Light Orange)
- Authentication and authorization checks
- Route protection and access control
- Role-based permission enforcement

### AI Flow (Light Yellow)
- Echo AI Advisor with three analysis types
- Intelligent vendor selection recommendations
- Ecosystem optimization suggestions
- Compliance assessment and risk analysis

### Dashboard Flow (Light Blue)
- Real-time KPI metrics and performance tracking
- Interactive charts and data visualization
- Activity feeds and notification management
- Risk alerts and compliance monitoring

## Key Components

### Security & Access Control
- **AuthGuard**: Protects all authenticated routes
- **AdminGuard**: Ensures admin-only access to management functions
- **OnboardingGuard**: Controls vendor progression through onboarding stages
- **RoleBasedRouter**: Handles role-specific routing logic

### Admin Components
- **DashboardLayout**: Main admin interface with sidebar navigation
- **ManageVendorsLayout**: Specialized vendor management interface
- **Echo AI Advisor**: AI-powered analysis and recommendation engine
- **Evaluation System**: Structured vendor assessment framework

### Vendor Components
- **VendorLayout**: Vendor-specific interface with responsive design
- **VendorProfileCompletion**: Multi-step profile completion process
- **VendorOnboarding**: Guided onboarding workflow
- **VendorActiveManagement**: Active vendor management portal

### Data & Analytics
- **Dashboard Analytics**: Real-time metrics and performance tracking
- **Performance Charts**: Interactive data visualization
- **Activity Monitoring**: Live activity feeds and event tracking
- **Risk Assessment**: Automated risk scoring and alerts

## Workflow Stages

### Vendor Onboarding Stages
1. **Application Submission**: Initial vendor application with basic information
2. **Profile Completion**: Detailed company, financial, and compliance information
3. **Document Upload**: Required certifications and supporting documents
4. **Admin Review**: BPI administrator evaluation and approval process
5. **Onboarding**: Final setup and system access configuration
6. **Active Management**: Ongoing vendor relationship management

### Admin Management Workflow
1. **Dashboard Overview**: Monitor key metrics and vendor status
2. **Vendor Evaluation**: Review and assess vendor applications
3. **AI-Assisted Analysis**: Use Echo AI for intelligent recommendations
4. **Decision Making**: Approve, reject, or request additional information
5. **Ongoing Management**: Monitor performance and compliance
6. **Renewal Processing**: Handle contract renewals and updates

## Technical Architecture

### Frontend Components
- **React Router**: Client-side routing with nested layouts
- **Context Providers**: Global state management for auth and theme
- **Protected Routes**: Route-level access control and guards
- **Responsive Design**: Mobile-first design with adaptive layouts

### Backend Integration
- **Supabase Auth**: Secure authentication with JWT tokens
- **Real-time Database**: Live data synchronization across clients
- **Row Level Security**: Database-level access control
- **File Storage**: Secure document upload and management

### AI Integration
- **Natural Language Processing**: Query interpretation and analysis
- **Machine Learning**: Vendor matching and recommendation algorithms
- **Risk Assessment**: Automated compliance and performance evaluation
- **Predictive Analytics**: Future performance and risk prediction