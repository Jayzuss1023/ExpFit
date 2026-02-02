"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBooking, cancelBooking } from "@/lib/actions/bookings";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tier } from "@/lib/constants/subscription";
import {
  TIER_HIERARCHY,
  TIER_DISPLAY_NAMES,
} from "@/lib/constants/subscription";

interface BookingButtonProps {
  sessionId: string;
  tierLevel: string;
  isFullyBooked: string;
  userTier: Tier | null;
  existingBookingId: string | null;
}

export function BookingButton({
  sessionId,
  tierLevel,
  isFullyBooked,
  userTier,
  existingBookingId,
}: BookingButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const router = useRouter();

  // Check if user can access this class tier
  const canAccss =
    userTier !== null &&
    TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[tierLevel as Tier];
  const requiredTier = tierLevel as Tier;
  const requiredTierName = TIER_DISPLAY_NAMES[requiredTier] || tierLevel;

  const handleBook = () => {
    setError(null);

    startTransition(async () => {
      // const result = await createBooking(sessionId)
    });
  };
}
