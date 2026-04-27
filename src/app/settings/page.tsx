'use client';
import SidebarWrapper from '@/components/SidebarWrapper';

export default function SettingsPage() {
  return (
    <SidebarWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-1">
            Settings
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your account and preferences
          </p>
        </header>

        <div className="bg-background-elevated border border-background-border rounded-xl p-6">
          <p className="text-sm text-text-secondary">Settings coming soon.</p>
        </div>
      </div>
    </SidebarWrapper>
  );
}
