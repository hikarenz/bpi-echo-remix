-- Add new enum values one by one
ALTER TYPE vendor_status ADD VALUE 'profile_pending';
ALTER TYPE vendor_status ADD VALUE 'profile_approved';
ALTER TYPE vendor_status ADD VALUE 'profile_rejected';
ALTER TYPE vendor_status ADD VALUE 'onboarding_in_progress';
ALTER TYPE vendor_status ADD VALUE 'fully_approved';
ALTER TYPE vendor_status ADD VALUE 'suspended';