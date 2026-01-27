import { auth } from "@clerk/nextjs/server";
import { MapPinIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
// import { ClassesContent } from "@/components/app/classes/ClassesContent";
// import { ClassesFilters } from "@/components/app/classes/ClassesFilters";
import { ClassSearch } from "@/components/app/classes/ClassSearch";
// import { ClassesMapSidebar } from "@/components/app/maps/ClassesMapSidebar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getUserPreferences } from "@/lib/actions/profile";
// import { filterSessionsByDistance, getBoundingBox } from "@/lib/utils/distance";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CATEGORIES_QUERY,
  FILTERED_SESSIONS_QUERY,
  USER_BOOKED_SESSION_IDS_QUERY,
  VENUE_NAME_BY_ID_QUERY,
} from "@/sanity/lib/queries";

import { SEARCH_SESSIONS_QUERY } from "@/sanity/lib/queries/sessions";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    venue?: string;
    category?: string;
    tier?: string;
  }>;
}

export default async function ClassesPage({ searchParams }: PageProps) {
  const {
    q: searchQuery,
    venue: venueId,
    category: categoryParam,
    tier: tierParam,
  } = await searchParams;
  const { userId } = await auth();

  // Parse multi-value filter params (comma-separated)
  const categoryIds = categoryParam
    ? categoryParam.split(",").filter(Boolean)
    : [];

  const tierLevels = tierParam ? tierParam.split(",").filter(Boolean) : [];

  // Get user preerences first - needed for bounding box calculation
  const userPreferences = await getUserPreferences();

  // User preferences are always set via onboarding - redirect if missing
  if (!userPreferences?.location || !userPreferences?.searchRadius) {
    redirect("/onboarding");
  }

  const { location, searchRadius } = userPreferences;

  // GEOGRAPHIC FILTERING - Two-step approach for performance:

  // Step 1 (Database): Calculate a rectangular bounding box from user's location + radius.
  // This is passed to GROQ to filter at the database level, reducing 100k+ bloval session
  // down to ~100-500 sessions within the user's general/
  //
  // Step (Client): The filterSessionsByDistance() function further refines results using
  // The Haversine formula for accurate circular distance calculation.  This handles the
  // corner cases where the rectangular bounding box extends beyond the circular radius,

  const { minLat, maxLat, minLng, maxLng } = getBoundingBox(
    location.lat,
    location.lng,
    searchRadius,
  );

  return (
    <div>
      {/* Page Header with Gradient */}
      <div>
        <div>
          <div>
            {/* Search + Filter Button */}
            <div>
              <Suspense
                fallback={
                  <div className="flex h-11 w-full items-center gap-2 rounded-full border bg-background px-4 sm:w-80 lg:w-96">
                    <SearchIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loading search...
                    </span>
                  </div>
                }
              >
                <ClassSearch className="w-full sm:w-80 lg:w-96" />
              </Suspense>

              {/* Filter Button (mobile/tablet) */}
              <div>
                <Suspense fallback={null}>
                  {/* <ClassesFilters
                  categories={categories}
                  activeFilters={{
                    venueId: venueId || null,
                    venueName,
                    categoryIds,
                    tierLevels,
                  }}
                  mobileOnly
                /> */}
                </Suspense>
              </div>
            </div>

            {/* Location Info */}
            <div>
              <MapPinIcon className="h-4 w-4 shrink-0 text-primary" />
              <p>
                <span>
                  Within
                  {/* {searchRadius} */}
                  mi of
                </span>{" "}
                <span>{/* {location.address} */}</span>
              </p>
              <Link href="/profile">Change</Link>
            </div>
          </div>

          {/* Search Results Indicator */}
          {searchQuery && (
            <div>
              <Badge>
                <SearchIcon className="h-3 w-3" />
                Results for &quot;{searchQuery}&quot;
              </Badge>
              <span>
                {/* {sessionWithDistance.length}{" "}{sessionWithDistance.length === 1 ? "class : "classes} found */}
              </span>
              <Link href="/classes">Clear Search</Link>
            </div>
          )}

          {/* Active Filters Indicator */}
          {/* {!searchQuery && activeFilterCount > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                {activeFilterCount}{" "}
                {activeFilterCount === 1 ? "filter" : "filters"} active
              </Badge>
              <span className="text-sm text-muted-foreground">
                {sessionsWithDistance.length}{" "}
                {sessionsWithDistance.length === 1 ? "class" : "classes"} found
              </span>
              <Link
                href="/classes"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Clear all filters
              </Link>
            </div>
          )} */}
        </div>
      </div>

      <main>
        <div>
          {/* Collapsible Filters Sidebar */}
          {/* <ClassesFilters categories={categories} activeFilters={{
                vanueId: venueId || null
                vanueName,
                categoryIds,
                tierLevels
            }}
            /> */}

          {/* Sessions Content */}
          <div>
            {/* <ClassesContent
                    groupedSessions={groupedArray}
                    bookedSessionIds={Array.from(bookedSessionIds)}
                /> */}
          </div>

          {/* Map Sidebar - Hidden on mobile/tablet, visible on xl screens */}
          <aside>
            <Card>
              {/* <ClassesMapSidebar
                    venues={venuesForMap}
                    userLocation={{lay: location.lat, lng: location.lng}}
                /> */}
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
