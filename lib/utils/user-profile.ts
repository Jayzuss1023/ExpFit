import { clerkClient } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { USER_PROFILE_ID_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/writeClient";

/**
 * Get or create a user profile in Sanity.
 * Returns the profile's _id.
 */
export async function getOrCreateUserProfile(
  clerkUserId: string,
): Promise<string> {
  //Check if the user profile exists
  const existingProfile = await client.fetch(USER_PROFILE_ID_QUERY, {
    clerkId: clerkUserId,
  });

  if (existingProfile) {
    return existingProfile._id;
  }

  // Fetvh user details from Clerk
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(clerkUserId);

  // Create new user pofile
  const newProfile = await writeClient.create({
    _type: "userProfile",
    clerkId: clerkUserId,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    subscriptionTier: "none",
    createdAt: new Date().toISOString(),
  });

  return newProfile._id;
}
