# NBA 2K Protocol - Health & Operations Guide

## Quick Health Check

### Authentication Flow
1. Homepage → Click "Join the Portal" → `/protocol/auth`
2. Click "Continue with Twitch" → Twitch OAuth
3. Returns to `/protocol/onboarding`
4. Complete 2-step profile (Global + NBA 2K)
5. Auto-redirects to `/protocol/lfg`
6. Returning users skip onboarding, go straight to LFG

### Database Health
Check recent activity in Supabase SQL Editor:
```sql
-- Recent signups
SELECT COUNT(*) FROM user_profiles WHERE created_at > NOW() - INTERVAL '24 hours';

-- Onboarding completion
SELECT onboarding_status, COUNT(*) FROM user_profiles GROUP BY onboarding_status;

-- Active LFG listings
SELECT COUNT(*) FROM lfg_listings WHERE status = 'active';
```

### Matcher Status
The matcher runs every 2 hours via edge function `run-matcher`.
- **Last run**: Check Admin panel → Health
- **Manual trigger**: Admin panel → "Run Matcher Now"

### Notification Health
View recent notification failures:
```sql
SELECT channel, status, COUNT(*) 
FROM notifications 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY channel, status;
```
**Target**: < 2% failure rate

## Required Configuration

### 1. Twitch OAuth Setup
Supabase Dashboard → Authentication → Providers → Twitch:
- Enable Twitch provider
- Set Client ID and Secret from Twitch Dev Console
- Add redirect URL: `https://yourdomain.com/protocol/onboarding`

### 2. Required Secrets
In Supabase Dashboard → Settings → Edge Functions:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET`

### 3. Optional (for full features)
- `DISCORD_WEBHOOK_URL` - Match notifications
- `SENDGRID_API_KEY` - Email notifications  
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` - SMS
- `STRIPE_SECRET_KEY` - Payments

## Troubleshooting

### Issue: Can't sign in with Twitch
1. Check Twitch provider is enabled in Supabase
2. Verify Client ID/Secret are correct
3. Check redirect URL matches your domain
4. View logs: Supabase → Authentication → Logs

### Issue: Stuck in onboarding loop
```sql
-- Manually mark onboarding complete
UPDATE user_profiles 
SET onboarding_status = 'complete'
WHERE user_id = 'USER_UUID';
```

### Issue: Matcher not creating matches
1. Check edge function logs for `run-matcher`
2. Verify cron job exists: Supabase → Database → Cron
3. Manual trigger from Admin panel

### Issue: Notifications not sending
Check logs for specific channel:
- Discord: `discord-bot-sender` logs
- Email: `send-email` logs  
- SMS: `send-sms` logs

## Support
Email: streamersupport@planetcuhz.com
