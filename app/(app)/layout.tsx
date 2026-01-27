import { ClerkProvider } from "@clerk/nextjs";
import type React from "react";
import { AppHeader } from "@/components/app/layout/AppHeader";
import { OnboardingGuard } from "@/components/app/onboarding/OnboardingGuard";
import { SanityLive } from "@/sanity/lib/live";

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
