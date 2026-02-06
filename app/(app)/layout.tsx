import { ClerkProvider } from "@clerk/nextjs";
import type React from "react";
import { AppHeader } from "@/components/app/layout/AppHeader";
import { OnboardingGuard } from "@/components/app/onboarding/OnboardingGuard";
import { SanityLive } from "@/sanity/lib/live";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <ChatStoreProvider>
        <OnboardingGuard>
          <AppHeader />
          {children}
        </OnboardingGuard>
        <SanityLive />
      </ChatStoreProvider>
    </ClerkProvider>
  );
}
