-- Add missing enum values for vendor workflow
ALTER TYPE vendor_status ADD VALUE 'profile_pending';
ALTER TYPE vendor_status ADD VALUE 'profile_approved';
ALTER TYPE vendor_status ADD VALUE 'profile_rejected';
ALTER TYPE vendor_status ADD VALUE 'onboarding_in_progress';
ALTER TYPE vendor_status ADD VALUE 'fully_approved';

-- Add timestamp columns for tracking workflow progress
ALTER TABLE public.vendor_companies 
ADD COLUMN IF NOT EXISTS profile_submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS final_approval_at TIMESTAMP WITH TIME ZONE;