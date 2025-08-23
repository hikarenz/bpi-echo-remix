import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface InvitationResult {
  success: boolean;
  error?: string;
  vendor_company_id?: string;
  company_name?: string;
}

export function useInvitationProcessing() {
  const [processing, setProcessing] = useState(false);

  const processInvitation = async (invitationToken: string, userId: string): Promise<InvitationResult> => {
    if (!invitationToken || !userId) {
      return { success: false, error: 'Missing invitation token or user ID' };
    }

    setProcessing(true);
    
    try {
      const { data, error } = await supabase.rpc('process_invitation_token', {
        p_invitation_token: invitationToken,
        p_user_id: userId
      });

      if (error) {
        console.error('Error processing invitation:', error);
        return { success: false, error: error.message };
      }

      return data as unknown as InvitationResult;
    } catch (error) {
      console.error('Error processing invitation:', error);
      return { success: false, error: 'Failed to process invitation' };
    } finally {
      setProcessing(false);
    }
  };

  return {
    processInvitation,
    processing
  };
}