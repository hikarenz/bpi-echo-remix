# VendorPro Application Flow Diagram

This diagram shows the complete flow of the VendorPro application, including authentication, role-based routing, and user workflows.

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
    
    Q --> U[ManageVendorsLayout]
    U --> V[Vendor List by Status]
    U --> W[Status-based Actions]
    
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
    
    %% Guards and Protections
    AA --> LL[OnboardingGuard]
    CC --> LL
    DD --> LL
    
    %% Auth Protection
    O --> MM[AuthGuard]
    HH --> MM
    U --> MM
    
    %% Special Cases
    NN[Not Found] --> OO[404 Page]
    
    %% Styling
    classDef authFlow fill:#e1f5fe
    classDef adminFlow fill:#f3e5f5
    classDef vendorFlow fill:#e8f5e8
    classDef guardFlow fill:#fff3e0
    
    class C,D,E,F,G,H authFlow
    class J,L,M,N,O,P,Q,R,S,T,U,V,W adminFlow
    class K,X,Y,Z,AA,BB,CC,DD,EE,FF,GG,HH,II,JJ,KK vendorFlow
    class LL,MM guardFlow
```

## Flow Description

### Authentication Flow (Light Blue)
- Initial authentication check and login/signup process
- Role determination and routing setup

### Admin Flow (Light Purple)
- BPI Admin dashboard and vendor management
- Access to evaluation, vendor addition/removal
- Status-based vendor organization

### Vendor Flow (Light Green)  
- Multi-stage vendor onboarding process
- Status-dependent access levels
- Profile completion and renewal workflows

### Guard Flow (Light Orange)
- Authentication and authorization checks
- Route protection and access control

## Key Components

- **AuthGuard**: Protects authenticated routes
- **AdminGuard**: Ensures admin-only access
- **OnboardingGuard**: Controls vendor onboarding flow
- **RoleBasedRouter**: Handles role-specific routing logic