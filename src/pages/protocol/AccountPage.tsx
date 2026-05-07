import SupportContact from '@/components/SupportContact';
import DiscordConnect from '@/components/DiscordConnect';
import { useOnboardedOrRedirect } from '@/lib/onboardGuard';

export default function AccountPage() {
  const ready = useOnboardedOrRedirect();

  if (!ready) return null;

  return (
    <main className="max-w-5xl">
      {/* Discord Connection */}
      <DiscordConnect />

      {/* Account Info */}
      <section className="protocol-card" style={{ padding: 20 }}>
        <h2 className="text-xl font-semibold" style={{ marginBottom: 12 }}>
          Account
        </h2>
        <p className="text-muted-foreground">
          Your account is set up and ready to use.
        </p>
      </section>

      <SupportContact />
    </main>
  );
}
