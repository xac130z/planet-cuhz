import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const TW_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const TW_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const FROM = Deno.env.get('TWILIO_FROM_NUMBER') || '';
const MSG_SID = Deno.env.get('TWILIO_MESSAGING_SERVICE_SID') || '';
const STATUS_CB = Deno.env.get('TWILIO_STATUS_WEBHOOK_URL') || '';

const base = `https://api.twilio.com/2010-04-01/Accounts/${TW_SID}/Messages.json`;
const auth = 'Basic ' + btoa(`${TW_SID}:${TW_TOKEN}`);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization",
};

// Input validation schema (E.164 phone format)
const SmsRequestSchema = z.object({
  to: z.string().regex(/^\+[1-9]\d{1,14}$/, { message: 'Invalid phone number (must be E.164 format)' }),
  body: z.string().min(1).max(1600, { message: 'SMS body must be 1-1600 characters' }),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate input with Zod
    const requestBody = await req.json();
    const validationResult = SmsRequestSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid input', details: validationResult.error.format() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { to, body } = validationResult.data;

    const form = new URLSearchParams();
    form.set('To', to);
    form.set('Body', body);
    
    if (MSG_SID) {
      form.set('MessagingServiceSid', MSG_SID);
    } else if (FROM) {
      form.set('From', FROM);
    } else {
      return new Response(
        JSON.stringify({ ok: false, error: 'No Twilio from number or messaging service configured' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (STATUS_CB) {
      form.set('StatusCallback', STATUS_CB);
    }

    console.log(`Sending SMS to ${to}`);

    const twRes = await fetch(base, {
      method: 'POST',
      headers: { 
        Authorization: auth, 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: form.toString(),
    });

    const responseText = await twRes.text();
    
    if (!twRes.ok) {
      console.error('Twilio error:', responseText);
      return new Response(
        JSON.stringify({ ok: false, error: 'SMS delivery failed' }),
        { status: twRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`SMS sent successfully to ${to}`);
    const responseData = JSON.parse(responseText);
    
    return new Response(
      JSON.stringify({ ok: true, payload: responseData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error('SMS function error:', e);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
