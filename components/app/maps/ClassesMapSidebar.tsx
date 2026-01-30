"use client";

import { MapPinIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import {
  Map as LeafletMap,
  MapMarker,
  MapPopup,
  MapTileLayer,
  MapZoomControl,
  useLeaflet,
} from "@/components/ui/map";
import type { UPCOMING_SESSIONS_QUERYResult } from "@/sanity.types";

// Venue type derived from the session query result
type SessionVenue = NonNullable<UPCOMING_SESSIONS_QUERYResult[number]["venue"]>;

interface ClassesMapSidebarProps {
  venues: SessionVenue[];
  userLocation: { lat: number; lng: number };
  highlightedVenueId?: string | null;
  onVenueClick?: (venueId: string) => void;
}

/**
 * Adjusts map view to fit all venue markers when filtered results change.
 * Re-runs whenever points array changes (filtering, search, etc)
 */
function MapBoundsFitter({ points }: { points: [number, number][] }) {
  const map = useMap();
  const { L } = useLeaflet();

  useEffect(() => {
    if (!L || points.length === 0) return;
    3;
    if (points.length === 1) {
      // Single point - center with comfortable zoom for context
      map.setView(points[0], 14, { animate: true });
    } else {
      // Multiple points - caluclate bounding box and fit all markers in view
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, {
        padding: [40, 40], // px buffer from edges
        maxZoom: 15, // don't zoom in too close
        animate: true,
      });
    }
  }, [L, points, map]);

  return null; // Render nothing, just side effects
}

/**
 * Sidebar map component for the classes page.
 * Displays markers for each unique venue with class copunts.
 */
export function ClassesMapSidebar({
  venues,
  userLocation,
  highlightedVenueId,
  onVenueClick,
}: ClassesMapSidebarProps) {
  // Count how many classes each venue has (venues array contains duplicates per class)
  const venueCounts = venues.reduce(
    (acc, venue) => {
      acc[venue._id] = (acc[venue._id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  /**
   * Deduplicate venues by _id and filter to only those with valid coordinates
   * Map key = venue._jd ensures uniqueness, .values() extracts the venue objects
   */
  const uniqueVenues = useMemo(
    () =>
      Array.from(
        new Map(
          venues
            .filter(
              (v) =>
                v.address &&
                typeof v.address.lat === "number" &&
                typeof v.address.lng === "number",
            )
            .map((v) => [v._id, v]),
        ).values(),
      ),
    [venues],
  );

  /**
   * All [lat, lng] coordinates the map should fit in view
   * Includes venue locations + user's home location for context
   */
  const boundsPoints = useMemo(() => {
    const pts: [number, number][] = uniqueVenues.map((v) => [
      v.address?.lat ?? 0,
      v.address?.lng ?? 0,
    ]);

    pts.push([userLocation.lat, userLocation.lng]);
    return pts;
  }, [uniqueVenues, userLocation]);

  // Center on user's preferred location (always available from onboarding)
  const center: [number, number] = [userLocation.lat, userLocation.lng];

  const handleVenueCLick = useCallback(
    (venue: SessionVenue) => {
      onVenueClick?.(venue._id);
    },
    [onVenueClick],
  );

  if (uniqueVenues.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <div className="text-center">
          <MapPinIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
          <p className="text-sm">No venues to display</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      <LeafletMap center={center} zoom={12} className="h-full w-full">
        <MapTileLayer />
        <MapZoomControl />

        {/* User's home location - small blue bot */}
        <MapBoundsFitter points={boundsPoints} />

        {/* User's home location -small blue dot */}
        <MapMarker
          position={[userLocation.lat, userLocation.lng]}
          icon={
            <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 borde-rwhite bg-blue-500 shadow-lg">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          }
          iconAnchor={[8, 8]}
        />

        {/* Venue Markrs */}
        {uniqueVenues.map((venue) => {
          const isHighlighted = highlightedVenueId === venue._id;
          const classCount = venueCounts[venue._id] || 0;

          return (
            <MapMarker
              key={venue._id}
              // biome-ignore lint/style/noNonNullAssertion: // biome-ignore lint: false positive
              position={[venue.address!.lat!, venue.address!.lng!]}
              icon={
                <div
                  className={`flex h-10 w-10 cursor pointer items-center justify-center rounded-full border-[3px] text-[13px] font-bold text-white shadow-lg transition-all ${
                    isHighlighted
                      ? "scale-125 border-yellow-400 bg-yellow-500"
                      : "border-white bg-linear-to-br from-primary to-primary/80 hover:scale-110"
                  }`}
                  style={{
                    boxShadow: isHighlighted
                      ? "0 4px 12px rgba(234, 179, 8, 0.5)"
                      : "0 4px 12px rgba(234, 88, 12, 0.4)",
                  }}
                >
                  {classCount}
                </div>
              }
              iconAnchor={[20, 20]} // Center the 40px icon on the coordinate
              eventHandlers={{ click: () => handleVenueCLick(venue) }}
            >
              <MapPopup>
                <div>
                  <div>
                    <h3>{venue.name}</h3>
                    {venue.city && <p>{venue.city}</p>}
                  </div>
                  <span>
                    {classCount} {classCount === 1 ? "class" : "classes"}
                  </span>
                  <Link href={`/classes?venue=${venue._id}`}>View Classes</Link>
                </div>
              </MapPopup>
            </MapMarker>
          );
        })}
      </LeafletMap>
    </div>
  );
}
