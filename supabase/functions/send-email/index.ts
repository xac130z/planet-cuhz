import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')!;
const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL') || 'protocol@planetcuhz.com';
const FROM_NAME = Deno.env.get('SENDGRID_FROM_NAME') || 'NBA 2K Protocol';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization",
};

// Input validation schema
const EmailRequestSchema = z.object({
  to: z.string().email({ message: 'Invalid email address' }).max(255),
  templateId: z.string().min(1, { message: 'Template ID required' }),
  dynamicData: z.record(z.any()).optional(),
  sandbox: z.boolean().optional(),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate input with Zod
    const requestBody = await req.json();
    const validationResult = EmailRequestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid input', details: validationResult.error.format() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { to, templateId, dynamicData, sandbox = false } = validationResult.data;

    const body = {
      personalizations: [
        {
          to: [{ email: to }],
          dynamic_template_data: dynamicData || {},
        },
      ],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      mail_settings: { 
        sandbox_mode: { enable: !!sandbox } 
      },
      template_id: templateId,
    };

    console.log(`Sending email to ${to} with template ${templateId} (sandbox: ${sandbox})`);

    const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!sgRes.ok) {
      const errorText = await sgRes.text();
      console.error('SendGrid error:', errorText);
      return new Response(
        JSON.stringify({ ok: false, error: 'Email delivery failed' }),
        { status: sgRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Email sent successfully to ${to}`);
    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error('Email function error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
