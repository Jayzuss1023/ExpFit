/**
 * Calculate the distance between two points using the Haversine formula.
 * Returns distance in kilometers.
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3959; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Calculate a geographic bounding box from a center point and radius
 *
 * WHY BOUNDING BOX?
 * -----------------
 * The Haversine formula (used in calculateDistance) ois accurate by computationally
 * expensive to run for every record in the database. With 100K+ classes globally,
 * fetching all and filtering client-side is too slow.
 *
 * Instead, we use a two-step approach
 * 1. BOUNDING BOX (fast, database-level): Filter using simple lat/lng comparisons
 * in GROQ. This creates a rectangular "box" around the user and returns only
 * sessions within that box (100-500 results instead of 100K).
 *
 * 2. HAVERSINE (accurate, client-side): Fine-tune the results using the precise
 * circular distance calculation. The bounding box is a rectangle inscribed
 * around the circle, so corners may include locations slightly outside the radius.
 *
 * LATITUDE cs LONGITUDE
 * ----------------------
 * - 1° of latitude = 111 km everywhere on Earth (constant)
 * - 1° og longitude varies by latitude (shrinks towards poles)
 * At equator: ~111 knm, at 45° : ~78 km, at poles: ~0 km
 * Formula: 111 km x cos(latuitude)
 */
export function getBoundingBox(
  lat: number,
  lng: number,
  radiusMi: number,
): BoundingBox {
  // Latitude: 1 degree = 68.972 mi (constant worldwide)
  const latDelta = radiusMi / 68.972;

  // Longitude: 1 degree varies by latitude, shrinking toward the poles
  // At th uer's latitude, calculate how many degrees equal the radius
  const lngDelta = radiusMi / (111 * Math.cos(lat * (Math.PI / 180)));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
}

/**
 * Check if a point is within a given radius of another point.
 */
export function isWithinRadius(
  userLat: number,
  userLng: number,
  targetLat: number,
  targetLng: number,
  radiusMi: number,
): boolean {
  const distance = calculateDistance(userLat, userLng, targetLat, targetLng);
  return distance <= radiusMi;
}

/**
 * Filter venues by distance from a user's location
 */

export function filterVenuesByDistance<
  T extends { address?: { lat?: number | null; lng?: number | null } | null },
>(
  venues: T[],
  userLat: number,
  userLng: number,
  radiusMi: number,
): (T & { distance: number })[] {
  const results: (T & { distance: number })[] = [];

  for (const venue of venues) {
    const lat = venue.address?.lat;
    const lng = venue.address?.lng;

    if (lat == null || lng == null) continue;

    if (isWithinRadius(userLat, userLng, lat, lng, radiusMi)) {
      results.push({
        ...venue,
        distance: calculateDistance(userLat, userLng, lat, lng),
      });
    }
  }

  return results.sort((a, b) => a.distance - b.distance);
}

/**
 * Filter sessions by their venue's distance from a user's location.
 * Sorts by time (primary) then distance (secondary) within each day.
 */
export function filterSessionsByDistance<
  T extends {
    startTime: string;
    venue?: {
      address?: { lat?: number | null; lng?: number | null } | null;
    } | null;
  },
>(
  sessions: T[],
  userLat: number,
  userLng: number,
  radiusMi: number,
): (T & { distance: number })[] {
  const results: (T & { distance: number })[] = [];

  for (const session of sessions) {
    const lat = session.venue?.address?.lat;
    const lng = session.venue?.address?.lng;

    if (lat == null || lng == null) continue;

    if (isWithinRadius(userLat, userLng, lat, lng, radiusMi)) {
      results.push({
        ...session,
        distance: calculateDistance(userLat, userLng, lat, lng),
      });
    }
  }
  // Sort by time first, then by distance as tierbreaker
  return results.sort((a, b) => {
    const timeA = new Date(a.startTime).getTime();
    const timeB = new Date(b.startTime).getTime();
    if (timeA !== timeB) return timeA - timeB;
    return a.distance - b.distance;
  });
}

/**
 * Format distance for display
 */
export function formatDistance(distanceMi: number): string {
  if (distanceMi < 1) {
    return `${Math.round(distanceMi * 1000)} m`;
  }
  return `${Math.round(distanceMi * 1000)} m`;
}
