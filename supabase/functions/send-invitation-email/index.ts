import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  recipientEmail: string;
  companyName: string;
  invitationLink: string;
  contactPerson?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send invitation email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, companyName, invitationLink, contactPerson }: InvitationEmailRequest = await req.json();
    
    console.log("Sending invitation email to:", recipientEmail);
    console.log("Company:", companyName);
    console.log("Invitation link:", invitationLink);

    const emailResponse = await resend.emails.send({
      from: "BPI HabiData <noreply@resend.dev>",
      to: [recipientEmail],
      subject: `Invitation to Join BPI HabiData - ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BPI HabiData Invitation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">BPI HabiData</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Vendor Onboarding Invitation</p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Welcome to BPI HabiData!</h2>
            
            <p>Dear ${contactPerson || 'Vendor Representative'},</p>
            
            <p>You have been invited to join BPI HabiData for <strong>${companyName}</strong>. This secure portal will allow you to:</p>
            
            <ul style="padding-left: 20px;">
              <li>Complete your vendor profile and documentation</li>
              <li>Track your onboarding progress</li>
              <li>Submit compliance documents</li>
              <li>Access vendor resources and updates</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 6px; 
                        font-weight: 600; 
                        font-size: 16px; 
                        display: inline-block;">
                Create Your Account
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #495057;">Important Information:</h4>
              <ul style="margin-bottom: 0; padding-left: 20px; color: #6c757d;">
                <li>This invitation link is valid for 7 days</li>
                <li>Use the email address: <strong>${recipientEmail}</strong></li>
                <li>Keep this link secure and do not share it</li>
                <li>Contact support if you need assistance</li>
              </ul>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
              If you cannot click the button above, copy and paste this link into your browser:
              <br>
              <a href="${invitationLink}" style="color: #667eea; word-break: break-all;">${invitationLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #6c757d; font-size: 12px; text-align: center; margin: 0;">
              This email was sent by BPI HabiData. If you received this email in error, please disregard it.
              <br>
              © ${new Date().getFullYear()} Bank of the Philippine Islands. All rights reserved.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-invitation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);