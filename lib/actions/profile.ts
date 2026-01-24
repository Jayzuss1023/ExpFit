"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeClient";
import { sanityFetch } from "@/sanity/lib/live";
import { USER_PROFILE_WITH_PREFERENCES_QUERY } from "@/sanity/lib/quieries";
import { getOrCreateUserProfile } from "../utils/user-profile";

export type ProfileResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export type LocationData = {
  lat: number;
  lng: number;
  address: string;
};

export type ProfilePreferences = {
  location: LocationData;
  searchRadius: number;
};

// Complete onboarding - save preferences and set Clerk metadata
export async function completeOnboarding(
  preferences: ProfilePreferences,
): Promise<ProfileResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const { location, searchRadius } = preferences;

    if (!location || !location.lat || !location.lng || !location.address) {
      return { success: false, error: "Location is required" };
    }

    // Get or create user profile
    const userProfileId = await getOrCreateUserProfile(userId);

    // Update Sanity profile with location preferences
    await writeClient
      .patch(userProfileId)
      .set({
        location: {
          lat: location.lat,
          lng: location.lng,
          address: location.address,
        },
        searchRadius,
      })
      .commit();

    // Update Clerk metadata to mark onboarding as complete
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        hasOnboarded: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/classes");
    revalidatePath("/profile");

    return { success: true, message: "Onboarding completed!" };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { success: false, error: "Failed to complete onboarding" };
  }
}
