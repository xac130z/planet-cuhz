import '../../styles/protocol.css';

interface ProtocolShellProps {
  children: React.ReactNode;
}

export default function ProtocolShell({ children }: ProtocolShellProps) {
  return (
    <div className="protocol-root">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            NBA 2K Protocol — 2K26
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base">
            Twitch-first teammate finder. Blacked-out UI with blue/red outlines.
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
