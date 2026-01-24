import { ClerkProvider } from "@clerk/nextjs";
import type React from "react";
import { AppHeader } from "@/components/app/layout/AppHeader";
import { SanityLive } from "@/sanity/lib/live";
import { OnboardingGuard } from "@/components/app/onboarding/OnboardingGuard";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <OnboardingGuard>
        <AppHeader />
        {children}
      </OnboardingGuard>
      <SanityLive />
    </ClerkProvider>
  );
}
