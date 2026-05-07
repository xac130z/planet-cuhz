# NBA 2K Protocol - Integrations Guide

## n8n Cloud Setup

### Plan Recommendation
Start with **Starter plan** ($24/mo, 2.5k executions):
- Welcome flow: ~2 executions per signup
- Daily digest: 1 execution per opted-in user/day
- For 100+ daily active users, upgrade to **Pro** ($60/mo, 10k executions)

### Workflow 1: profile-created (Webhook)

**Trigger**: Webhook POST `/webhook/profile-created`

**Steps**:
1. **Webhook Node** - Receive POST with HMAC signature
   - Verify `X-CUHZ-Signature` header:
     ```javascript
     const crypto = require('crypto');
     const signature = $('Webhook').headers['x-cuhz-signature'];
     const payload = JSON.stringify($('Webhook').json);
     const hmac = crypto.createHmac('sha256', '{{$env.CUHZ_SIGNING_SECRET}}');
     hmac.update(payload);
     const expected = `sha256=${hmac.digest('hex')}`;
     if (signature !== expected) throw new Error('Invalid signature');
     ```

2. **Supabase Node** - Fetch user details
   - Query: `SELECT * FROM user_profiles WHERE user_id = {{$json.user_id}}`

3. **IF Node** - Check consent & preferences
   - Condition: `{{$json.consent_comms}} === true`

4. **SendGrid Node** - Send welcome email
   - Template ID: Configure in SendGrid
   - Dynamic data:
     ```json
     {
       "display_name": "{{$json.display_name}}",
       "finder_url": "https://planetcuhz.com/protocol/lfg",
       "support_email": "streamersupport@planetcuhz.com"
     }
     ```

5. **Twilio Node** - Send welcome SMS (if phone & sms opted in)
   - Condition: `{{$json.phone}} && {{$json.preferred_contact}} === 'sms'`
   - Message: `NBA 2K Protocol: Your profile is live! Find your squad at planetcuhz.com/protocol/lfg — Reply STOP to opt out`

6. **Supabase Node** - Log to comms_logs
   - Insert: `{ user_id, event_type: 'welcome', channel: 'n8n', status: 'sent' }`

7. **Error Trigger** - Alert on failure
   - Send Slack/email to admin channel

### Workflow 2: digest-daily (Cron)

**Trigger**: Cron `0 9 * * *` (9 AM daily)

**Steps**:
1. **Supabase Node** - Fetch users by timezone
   - Query: `SELECT user_id, timezone FROM user_profiles WHERE digest_cadence = 'daily' AND consent_comms = true GROUP BY timezone`

2. **Loop Over Items** - Process each timezone
   
3. **Supabase Node** - Get users in timezone
   - Query: `SELECT * FROM user_profiles WHERE timezone = '{{$json.timezone}}' AND digest_cadence = 'daily'`

4. **Supabase Node** - Get recent matches for users
   - Query: `SELECT * FROM matches WHERE member_ids && {{$json.user_ids}} AND created_at > NOW() - INTERVAL '1 day'`

5. **SendGrid Node** - Send digest email
   - Template with match summaries
   - Batch up to 100 users per execution

6. **Supabase Node** - Log delivery

### Workflow 3: digest-weekly (Cron)

**Trigger**: Cron `0 9 * * 1` (9 AM Monday)

Similar to daily but:
- Filter: `digest_cadence = 'weekly'`
- Match window: `created_at > NOW() - INTERVAL '7 days'`

## Environment Variables (Supabase Edge Functions)

Configure in Supabase Dashboard → Settings → Edge Functions:

```bash
# n8n Integration
N8N_WEBHOOK_URL=https://your-subdomain.n8n.cloud/webhook/profile-created
N8N_SIGNING_SECRET=your_secret_key_here

# SendGrid (Fallback & Templates)
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=welcome@planetcuhz.com
SENDGRID_FROM_NAME=NBA 2K Protocol
SENDGRID_TEMPLATE_WELCOME=d-xxx
SENDGRID_TEMPLATE_MATCH_NEW=d-xxx
SENDGRID_TEMPLATE_MATCH_MUTUAL=d-xxx

# Twilio (Fallback & SMS)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_MESSAGING_SERVICE_SID=MGxxx
TWILIO_STATUS_WEBHOOK_URL=https://wjebryxdefcgsxsqomac.supabase.co/functions/v1/sms-status

# App URLs
NEXT_PUBLIC_APP_URL=https://planetcuhz.com
VITE_SUPPORT_EMAIL=streamersupport@planetcuhz.com
```

## SendGrid Templates

### Template: Welcome (d-xxx)

**Subject**: Welcome to NBA 2K Protocol — Your Squad Awaits

**HTML**:
```html
<!doctype html>
<html>
  <body style="background:#0b0f1a;color:#e4e7ee;font-family:Inter,Arial,sans-serif;padding:24px;">
    <h1 style="color:#7cf3ff;margin:0 0 8px;">Welcome to NBA 2K Protocol</h1>
    <p style="opacity:.9;">Hey {{display_name}}, your squad signal is live.</p>
    <p>We'll send you <strong>{{digest_cadence}} digests</strong> when matches ping across the CUHZ grid.</p>
    <p>
      <a href="{{finder_url}}" style="background:#00e5ff;color:#051017;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">
        Open Squad Finder
      </a>
    </p>
    <p style="font-size:12px;opacity:.7;">
      You can change email/SMS settings anytime from your 
      <a href="{{finder_url}}/../account" style="color:#7cf3ff;">profile</a>.
    </p>
    <hr style="border:1px solid rgba(255,255,255,0.1);margin:24px 0;">
    <p style="font-size:12px;opacity:.6;">
      Need help? <a href="mailto:{{support_email}}" style="color:#7cf3ff;">{{support_email}}</a>
    </p>
  </body>
</html>
```

## Twilio Setup

1. **A2P Registration** (US only, required for SMS)
   - Register brand at Twilio Console → Messaging → Regulatory Compliance
   - Approve use case: "Sports team matching & notifications"
   - Wait 2-5 business days for approval

2. **Messaging Service**
   - Create service: Console → Messaging → Services
   - Add phone number pool
   - Set Inbound webhook: `https://wjebryxdefcgsxsqomac.supabase.co/functions/v1/sms-inbound`
   - Set Status webhook: `https://wjebryxdefcgsxsqomac.supabase.co/functions/v1/sms-status`

3. **Compliance**
   - SMS must include opt-out: "Reply STOP to unsubscribe"
   - Our inbound handler processes STOP/START automatically
   - Updates `user_profiles.consent_comms` accordingly

## Testing

### 1. Welcome Flow Test
```bash
# Complete onboarding in UI
# Check n8n execution log for webhook receipt
# Verify email in SendGrid Activity
# Verify SMS in Twilio Messaging Logs
# Confirm comms_logs entry in Supabase
```

### 2. Fallback Test
```bash
# Temporarily disable n8n webhook or set invalid URL
# Complete onboarding
# Verify SendGrid/Twilio direct send
# Check comms_logs for provider='sendgrid_fallback'
```

### 3. SMS Opt-Out Test
```bash
# Send SMS to your Twilio number: "STOP"
# Verify user_profiles.consent_comms = false
# Attempt another notification → should skip
```

### 4. Digest Cron Test
```bash
# In n8n, manually trigger digest-daily workflow
# Verify SendGrid sends to test user
# Check execution count (1 per timezone batch, not per user)
```

## Monitoring

### Health Dashboard (`/protocol/admin`)
- Last 10 notification failures with error details
- n8n webhook success rate
- SendGrid/Twilio delivery rates
- Matcher run status

### Logs to Watch
- Supabase Edge Function logs: `supabase functions logs profile-created`
- n8n execution history
- SendGrid Activity Feed
- Twilio Messaging Logs
- `comms_logs` table in Supabase

## Cost Optimization

### n8n
- Batch digest sends (1 execution per 100 users)
- Use conditional nodes to skip inactive users
- Set up error retries in n8n (not just edge function)

### SendGrid
- Use dynamic templates (no charge per email)
- Stay under 100 emails/day on free tier for testing
- Upgrade to Essentials ($20/mo, 50k emails) for production

### Twilio
- Use Messaging Services (cheaper than individual numbers)
- A2P registration unlocks 10DLC (higher throughput, lower cost)
- Monitor for STOP replies to avoid wasted sends

## Troubleshooting

**Issue**: n8n webhook returns 401
- Verify `X-CUHZ-Signature` header matches HMAC
- Check `N8N_SIGNING_SECRET` matches in both systems

**Issue**: Email not arriving
- Check SendGrid Activity for bounces/spam
- Verify `SENDGRID_FROM_EMAIL` is verified in SendGrid
- Check user's spam folder

**Issue**: SMS not arriving  
- Verify `TWILIO_MESSAGING_SERVICE_SID` is set (not `TWILIO_FROM`)
- Check Twilio logs for carrier errors
- Ensure phone format is E.164 (+1XXXYYYZZZZ)

**Issue**: Duplicate welcome messages
- Check `comms_logs` for existing welcome entry
- Edge function has idempotency check; verify it runs

**Issue**: Digest not sending
- Verify n8n cron is active
- Check timezone mapping in workflow
- Ensure users have `digest_cadence != 'off'`
