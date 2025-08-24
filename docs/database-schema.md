# VendorPro Database Schema Documentation

This document provides a comprehensive overview of all database tables in the VendorPro application, their relationships, and how they support various features.

## Overview

The VendorPro database consists of 7 main tables that support the complete vendor lifecycle management system:

1. **profiles** - User account information and roles
2. **vendor_companies** - Company information and status tracking
3. **vendor_users** - Links users to their vendor companies
4. **vendor_invitations** - Manages invitation tokens for vendor onboarding
5. **compliance_documents** - Document management and compliance tracking
6. **notifications** - User notification system
7. **audit_logs** - System activity logging and compliance

## Table Definitions

### 1. profiles
**Purpose**: Stores user account information and role-based access control.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | - | Primary key, references auth.users(id) |
| email | text | No | - | User's email address |
| first_name | text | Yes | - | User's first name |
| last_name | text | Yes | - | User's last name |
| role | user_role | No | 'vendor' | User role: 'vendor' or 'bpi_admin' |
| created_at | timestamp | Yes | now() | Account creation timestamp |
| updated_at | timestamp | Yes | now() | Last update timestamp |

**App Features Supported**:
- Authentication and user management
- Role-based routing (Admin vs Vendor access)
- User profile information display
- Authorization for all protected routes

**RLS Policies**:
- Users can view/update their own profile
- Admins can view all profiles
- No direct insert (handled by trigger on auth.users)

### 2. vendor_companies
**Purpose**: Central table for vendor company information and lifecycle status tracking.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| company_name | text | No | - | Official company name |
| company_email | text | No | - | Company contact email |
| company_address | text | Yes | - | Company physical address |
| contact_person | text | Yes | - | Primary contact person |
| contact_phone | text | Yes | - | Contact phone number |
| status | vendor_status | Yes | 'pending' | Current lifecycle status |
| risk_level | risk_level | Yes | 'medium' | Risk assessment level |
| category | text | Yes | - | Business category/industry |
| performance_score | integer | Yes | 0 | Performance rating (0-100) |
| contract_start_date | date | Yes | - | Contract effective date |
| contract_end_date | date | Yes | - | Contract expiration date |
| profile_submitted_at | timestamp | Yes | - | When profile was first submitted |
| profile_approved_at | timestamp | Yes | - | When profile was approved |
| onboarding_completed_at | timestamp | Yes | - | When onboarding was completed |
| final_approval_at | timestamp | Yes | - | When final approval was granted |
| created_at | timestamp | Yes | now() | Record creation timestamp |
| updated_at | timestamp | Yes | now() | Last update timestamp |

**Status Values**:
- `pending` - Initial submission, awaiting review
- `profile_approved` - Profile approved, ready for onboarding
- `onboarding_in_progress` - Currently in onboarding process
- `fully_approved` - Completed onboarding, active vendor
- `rejected` - Application rejected
- `suspended` - Temporarily suspended
- `terminated` - Contract terminated

**App Features Supported**:
- Vendor application and profile management
- Multi-stage approval workflow
- Status-based routing and UI display
- Contract management
- Performance tracking
- Risk assessment
- Dashboard analytics and reporting

**RLS Policies**:
- Vendors can view/update their own company
- Admins can manage all companies
- Authenticated users can insert (for new applications)

### 3. vendor_users
**Purpose**: Links individual users to vendor companies, supporting multi-user companies.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | Yes | - | References profiles(id) |
| vendor_company_id | uuid | Yes | - | References vendor_companies(id) |
| created_at | timestamp | Yes | now() | Association creation timestamp |

**App Features Supported**:
- Multi-user vendor companies
- User-to-company association
- Role-based data access
- Invitation system integration

**RLS Policies**:
- Users can view/update their own associations
- Users can insert their own associations
- Admins can manage all associations

### 4. vendor_invitations
**Purpose**: Manages invitation tokens for onboarding new vendor users.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| vendor_company_id | uuid | Yes | - | Company being invited to |
| invited_email | text | No | - | Email address of invitee |
| invitation_token | text | No | - | Unique invitation token |
| created_by | uuid | Yes | - | Admin who created invitation |
| expires_at | timestamp | No | - | Invitation expiration time |
| used_at | timestamp | Yes | - | When invitation was used |
| created_at | timestamp | Yes | now() | Invitation creation timestamp |

**App Features Supported**:
- Admin-initiated vendor invitations
- Secure token-based onboarding
- Email invitation system
- Invitation expiration and usage tracking
- Multi-user company setup

**RLS Policies**:
- Only admins can manage invitations

### 5. compliance_documents
**Purpose**: Manages document uploads, reviews, and compliance tracking.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| vendor_company_id | uuid | Yes | - | Associated vendor company |
| document_type | text | No | - | Type/category of document |
| document_name | text | No | - | Display name of document |
| file_path | text | Yes | - | Storage path to file |
| status | compliance_status | Yes | 'not_submitted' | Review status |
| submitted_at | timestamp | Yes | - | When document was submitted |
| reviewed_by | uuid | Yes | - | Admin who reviewed document |
| reviewed_at | timestamp | Yes | - | When review was completed |
| review_notes | text | Yes | - | Admin review comments |
| expires_at | date | Yes | - | Document expiration date |
| created_at | timestamp | Yes | now() | Record creation timestamp |
| updated_at | timestamp | Yes | now() | Last update timestamp |

**Status Values**:
- `not_submitted` - Required but not yet uploaded
- `submitted` - Uploaded, awaiting review
- `approved` - Approved by admin
- `rejected` - Rejected with feedback
- `expired` - Document has expired

**App Features Supported**:
- Document upload and management
- Compliance tracking and reporting
- Admin review workflows
- Document expiration monitoring
- Audit trail for document changes

**RLS Policies**:
- Vendors can manage their company documents
- Admins can manage all documents

### 6. notifications
**Purpose**: User notification system for important events and updates.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| recipient_id | uuid | Yes | - | User receiving notification |
| title | text | No | - | Notification title |
| message | text | No | - | Notification content |
| type | text | Yes | 'info' | Notification type (info, warning, error) |
| read_at | timestamp | Yes | - | When notification was read |
| created_at | timestamp | Yes | now() | Notification creation timestamp |

**App Features Supported**:
- Real-time user notifications
- Status change alerts
- System announcements
- Read/unread tracking
- Different notification types

**RLS Policies**:
- Users can view/update their own notifications
- No direct insert (system-generated)

### 7. audit_logs
**Purpose**: Comprehensive system activity logging for compliance and debugging.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | Yes | - | User who performed action |
| action | text | No | - | Action performed |
| resource_type | text | No | - | Type of resource affected |
| resource_id | uuid | Yes | - | ID of affected resource |
| details | jsonb | Yes | - | Additional action details |
| ip_address | inet | Yes | - | User's IP address |
| user_agent | text | Yes | - | User's browser/client info |
| created_at | timestamp | Yes | now() | When action occurred |

**App Features Supported**:
- Security audit trails
- Compliance reporting
- System debugging
- User activity tracking
- Change history

**RLS Policies**:
- Only admins can view audit logs
- No insert/update/delete (system-managed)

## Relationships and Connections

### Core Relationships
```
auth.users (Supabase) → profiles (1:1)
profiles → vendor_users (1:many)
vendor_companies → vendor_users (1:many)
vendor_companies → compliance_documents (1:many)
vendor_companies → vendor_invitations (1:many)
profiles → notifications (1:many)
```

### Feature Mappings

**Authentication System**:
- `profiles` - User accounts and roles
- `vendor_users` - Company associations

**Vendor Lifecycle Management**:
- `vendor_companies` - Central status and information tracking
- `vendor_invitations` - Onboarding new vendors
- `compliance_documents` - Document requirements

**Admin Dashboard**:
- `vendor_companies` - Vendor overview and management
- `audit_logs` - System activity monitoring
- `compliance_documents` - Document review workflows

**Vendor Portal**:
- `vendor_companies` - Company profile and status
- `compliance_documents` - Document uploads
- `notifications` - Status updates and alerts

**Security and Compliance**:
- All tables have Row Level Security (RLS) enabled
- `audit_logs` - Complete activity tracking
- `compliance_documents` - Document compliance monitoring

## Database Functions

The schema includes several security definer functions:
- `get_user_role(uuid)` - Safely retrieve user role
- `get_user_vendor_company_id(uuid)` - Get user's associated company
- `process_invitation_token(text, uuid)` - Handle invitation processing
- `handle_new_user()` - Trigger for new user setup

These functions prevent RLS recursion issues and provide secure data access patterns.