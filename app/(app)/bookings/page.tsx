import { auth } from "@clerk/nextjs/server";
import { isPast } from "date-fns";
import {
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AttendanceAlert } from "@/components/app/bookings/AttendanceAlert";
import { BookingsCalendarView } from "@/components/app/bookings/BookingsCalendarView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { BookingCard } from "@/components/app/bookings/BookingCard";
import { getUsageStats } from "@/lib/subscription";
import { sanityFetch } from "@/sanity/lib/live";
import { USER_BOOKINGS_QUERY } from "@/sanity/lib/queries/bookings";

export default async function BookingsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("sign-in");
  }

  const [{ data: bookings }, usageStats] = await Promise.all([
    sanityFetch({ query: USER_BOOKINGS_QUERY, params: { clerkId: userId } }),
    getUsageStats(userId),
  ]);

  // Filter out bookings with invalid data
  const validBookings = bookings.filter(
    (b) => b.status && b.classSession?.startTime,
  );

  // Sort upcoming bookings (earliest first)
  const upcomingBookings = validBookings
    .filter(
      (b) =>
        b.status === "confirmed" &&
        b.classSession?.startTime &&
        !isPast(new Date(b.classSession.startTime)),
    )
    .sort((a, b) => {
      const aTime = a.classSession?.startTime
        ? new Date(a.classSession.startTime).getTime()
        : 0;
      const bTime = b.classSession?.startTime
        ? new Date(b.classSession.startTime).getTime()
        : 0;
      return aTime - bTime;
    });

  // Sort past bookings (most recent first)
  const pastBookings = validBookings
    .filter(
      (b) =>
        b.status !== "confirmed" ||
        (b.classSession?.startTime &&
          isPast(new Date(b.classSession.startTime))),
    )
    .sort((a, b) => {
      const aTime = a.classSession?.startTime
        ? new Date(a.classSession.startTime).getTime()
        : 0;
      const bTime = b.classSession?.startTime
        ? new Date(b.classSession.startTime).getTime()
        : 0;
      return bTime - aTime;
    });

  return (
    <div>
      <div>
        <div>
          <h1>My Bookings</h1>
          <p>Manage your upcoming and past fitness classes</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Attendance Confirmation Alert */}
        <AttendanceAlert bookings={bookings} />

        {/* Calendar View */}
        <section>
          <div>
            <Calendar className="h-5 w-5 text-primary" />
            <h2>Calendar View</h2>
          </div>
          <BookingsCalendarView bookings={bookings} />
        </section>
      </main>
    </div>
  );
}
