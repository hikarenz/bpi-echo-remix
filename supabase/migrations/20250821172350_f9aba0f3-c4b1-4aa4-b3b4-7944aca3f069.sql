-- Update vendor_status enum to include new granular statuses
ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'profile_pending';
ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'profile_approved';
ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'profile_rejected';
ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'onboarding_in_progress';
ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'fully_approved';
ALTER TYPE vendor_status ADD VALUE IF NOT EXISTS 'suspended';

-- Add timestamp columns for tracking workflow progress
ALTER TABLE public.vendor_companies 
ADD COLUMN IF NOT EXISTS profile_submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS final_approval_at TIMESTAMP WITH TIME ZONE;

-- Update default status to profile_pending for new vendors
ALTER TABLE public.vendor_companies 
ALTER COLUMN status SET DEFAULT 'profile_pending'::vendor_status;