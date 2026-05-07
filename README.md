# Planet CUHZ — NBA 2K Protocol

Production-ready team matching platform for NBA 2K (2K26) with Twitch authentication, LFG, intelligent matching, Discord bot integration, and Stripe payments.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account (free tier works)
- Twitch Developer App
- (Optional) Discord Bot, SendGrid, Twilio, Stripe accounts for full features

### Installation

```bash
# Clone and install
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install  # or pnpm install

# Set up environment (see .env.local.sample)
cp .env.local.sample .env.local

# Start dev server
npm run dev
```

Visit `http://localhost:5173` (home page) or `http://localhost:5173/protocol/auth` (Protocol auth).

---

## 📋 Features by Phase

### Phase 1: Twitch Auth
- `/protocol/auth` - Twitch OAuth login
- Session guards redirect unauthenticated users
- Fallback link for new Twitch signups

### Phase 2: Onboarding
- 2-step wizard: Global profile + NBA 2K specifics
- Handle normalization (PSN, Xbox, Discord, Twitch)
- Reachability guard: private handle sharing requires email or phone
- Saves to `user_profiles.profile` (JSONB) + top-level fields

### Phase 3: LFG (Looking for Group)
- `/protocol/lfg` - Browse and create listings
- Featured Boost (7-day pin, Stripe SKU)
- Report button → moderation queue
- RLS policies on `lfg_listings` and `lfg_applications`

### Phase 4: Matching Engine
- Pair scoring (0-100) with 15+ weighted factors
- Squad5 assembly with position coverage bonus
- Edge function `run-matcher` (manual trigger or cron every 2h)
- "Why matched" bullets stored in `matches.explanation`

### Phase 5: Notifications
- `/protocol/respond?matchId=<id>&action=<accept|decline>` - One-click response
- Discord webhook fallback
- Updates `match_responses` table
- Mutual accept triggers intro notification

### Phase 6: Payments & Deals
- Stripe checkout for Founders, Team Assembly, 7G Roles, Coaching
- `/plans` and `/protocol/deals` pages
- Webhook updates `entitlements`, `bookings`, `team_builds`, `payments_audit`
- Customer portal link on `/protocol/account`

### Phase 7: Admin & Moderation
- `/protocol/admin` - RBAC-gated console
- Moderation queue (content flags, bans, profanity auto-flag)
- Actions: Close/Delete/Ban listings, Seed data, Run matcher
- Audit logs in `admin_audit_logs`

### Phase 8: Discord Bot Mode
- DM notifications with Accept/Decline buttons
- Slash commands: `/my-matches`, `/accept <matchId>`, `/decline <matchId>`, `/link`
- OAuth flow to save `discord_conn` in profile
- Mutual accept creates intro thread in configured channel
- Privacy rules enforced (handles only after mutual accept if allowed)

### Phase 9: Email & SMS (Production)
- SendGrid templates (new match, mutual accept, reminder)
- Twilio SMS sender with "Stop=unsubscribe"
- Edge functions: `send-email`, `send-sms`, `sms-status`
- Exponential retry (0.5s → 1s → 2s)
- Logs to `notifications` table with status (sent/failed)

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- TypeScript
- Tailwind CSS (custom design system: black theme, blue/red outlines)
- shadcn/ui components
- React Router v6

**Backend:**
- Supabase (Auth, Postgres, Storage, Edge Functions)
- Deno (Edge Functions runtime)
- SendGrid (Email)
- Twilio (SMS)
- Discord Bot API
- Stripe (Payments)

**Database:**
- PostgreSQL (via Supabase)
- Row-Level Security (RLS) policies
- JSONB for flexible profile storage

---

## ⚙️ Configuration

### Required Supabase Secrets

Set in Supabase Dashboard → Settings → Edge Functions:

```bash
# Core
SUPABASE_URL=https://wjebryxdefcgsxsqomac.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# SendGrid (Email)
SENDGRID_API_KEY=SG.***
SENDGRID_FROM_EMAIL=protocol@planetcuhz.com
SENDGRID_FROM_NAME=NBA 2K Protocol
SENDGRID_SANDBOX_MODE=false
SENDGRID_TEMPLATE_MATCH_NEW=d-***
SENDGRID_TEMPLATE_MATCH_MUTUAL=d-***
SENDGRID_TEMPLATE_REMINDER=d-***

# Twilio (SMS)
TWILIO_ACCOUNT_SID=AC***
TWILIO_AUTH_TOKEN=***
TWILIO_FROM_NUMBER=+1***
TWILIO_MESSAGING_SERVICE_SID=MG***
TWILIO_STATUS_WEBHOOK_URL=https://wjebryxdefcgsxsqomac.supabase.co/functions/v1/sms-status

# Discord Bot
DISCORD_MODE=bot
DISCORD_BOT_TOKEN=***
DISCORD_PUBLIC_KEY=***
DISCORD_APP_ID=***
DISCORD_INTRO_CHANNEL_ID=***
DISCORD_WEBHOOK_URL=<fallback>

# Stripe
STRIPE_SECRET_KEY=sk_***
STRIPE_WEBHOOK_SECRET=whsec_***
PRICE_FOUNDERS_6MO=price_***
PRICE_TEAM_ASSEMBLY=price_***

# App
VITE_SUPPORT_EMAIL=streamersupport@planetcuhz.com
NEXT_PUBLIC_APP_URL=https://planetcuhz.com
```

---

## 🔄 Cron Jobs

### Matcher Job (Every 2 hours)

Run in Supabase SQL Editor:

```sql
select cron.schedule(
  'run-matcher-2h',
  '0 */2 * * *',
  $$
  select net.http_post(
    url:='https://wjebryxdefcgsxsqomac.supabase.co/functions/v1/run-matcher',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
    body:='{}'::jsonb
  ) as request_id;
  $$
);
```

---

## 🧪 Testing & Health

### Health Dashboard

Visit `/protocol/admin` → **Health** tab for:
- ✅ Matcher status (last run < 2h)
- ✅ Notification fail rate < 2%
- ✅ Required secrets configured

**Go/No-Go:** All green = production ready

### Manual Smoke Tests

See [HEALTH.md](./HEALTH.md) for full test suite and troubleshooting guide.

---

## 📁 Project Structure

```
src/pages/protocol/    # Protocol pages (auth, onboarding, lfg, matches, admin)
src/components/admin/  # Admin components (health, actions, moderation)
src/lib/              # Utilities (discord, email, sms, matching)
supabase/functions/   # Edge functions (matcher, notify, payments)
supabase/sql/         # Database migrations
HEALTH.md            # Ops runbook
```

---

## 🚨 Support

- **Email:** streamersupport@planetcuhz.com
- **Docs:** [HEALTH.md](./HEALTH.md)
- **Lovable Project:** https://lovable.dev/projects/f34937ac-f1fe-4563-812c-f233650d7f74

Built with 🏀 for the NBA 2K community.

---

## 📝 Original Lovable Info

**Lovable Project URL**: https://lovable.dev/projects/f34937ac-f1fe-4563-812c-f233650d7f74

**How to deploy:** Open Lovable and click Share → Publish

**Custom domain:** Project > Settings > Domains → Connect Domain

**Technologies:** Vite, TypeScript, React, shadcn-ui, Tailwind CSS, Supabase
