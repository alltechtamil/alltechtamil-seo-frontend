import { Metadata } from 'next';
import { ErrorLogManager } from '@/components/admin/ErrorLogManager';

export const metadata: Metadata = {
  title: 'Diagnostic Error Logs | Admin Dashboard',
  description: 'Monitor backend telemetry, uncaught exceptions, and API failure logs.',
};

export default function AdminErrorLogsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <header>
        <h1 className="text-3xl font-black text-on-background tracking-tight text-error flex items-center gap-3">
          Diagnostic Telemetry
        </h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
          Review system exceptions, database failures, and third-party API limits caught by the backend error handlers.
        </p>
      </header>

      <section>
        <ErrorLogManager />
      </section>
    </div>
  );
}
