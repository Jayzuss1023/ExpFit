import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon, Clock, MapPin, User } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { format } from "date-fns";
import type { FILTERED_SESSIONS_QUERYResult } from "@/sanity.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TIER_COLORS } from "@/lib/constants/subscription";
import { formatDistance } from "@/lib/utils/distance";

// Session type from the query result (with distance added by client-side filtering)
type Session = FILTERED_SESSIONS_QUERYResult[number];

interface SessionCardProps {
  session: Session;
  isBooked?: boolean;
  distance?: number;
}
export function SessionCard({
  session,
  isBooked = false,
  distance,
}: SessionCardProps) {
  // Guard against missing required data
  const { activity, venue, startTime, maxCapacity } = session;
  if (!activity || !venue || !startTime || !maxCapacity) return null;

  const spotsRemaining = maxCapacity - session.currentBookings;
  const isFullyBooked = spotsRemaining <= 0;
  const startDate = new Date(startTime);
  const tierLevel = activity.tierLevel ?? "basic";

  return (
    <Link href={`/classes/${session._id}`}>
      <Card>
        <div className="relative aspect-video overflow-hidden bg-muted">
          {activity.image ? (
            <Image
              src={urlFor(activity.image).width(400).height(225).url()}
              alt={activity.name ?? "Class"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Tier Badge */}
          <Badge className={`absolute left-3 top-3`}>
            {tierLevel.charAt(0).toUpperCase() + tierLevel.slice(1)} Tier
          </Badge>

          {/* Status Badge */}
          {isBooked ? (
            <Badge className="absolute right-3 top-3 gap-1">
              <CheckCircleIcon className="h-3 w-3" />
              Booked
            </Badge>
          ) : null}

          {/* Distance Badge */}
          {distance !== undefined && (
            <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-md backdrop-blur-sm dark:bg-black/80">
              {formatDistance(distance)}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent>
          <h3>{activity.name}</h3>

          <div>
            <p>
              <User className="w-3.5 h-3.5" />
              <span>{activity.instructor}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{activity.duration}</span>
            </p>
            <p>
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {venue.name}
                {venue.city && ` • ${venue.city}`}
              </span>
            </p>
          </div>

          {/* Date/Time */}
          <div>
            <div>{format(startDate, "EEE, MMM d")}</div>
            <div>{format(startDate, "h:mm a")}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
