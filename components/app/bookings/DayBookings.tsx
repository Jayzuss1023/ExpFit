"use client";

import { format, isSameDay, isToday, isPast } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import {
  BOOKING_STATUS_COLORS,
  getStatusLabel,
  getEffectiveStatus,
} from "@/lib/constants/status";
import type { USER_BOOKINGS_QUERYResult } from "@/sanity.types";

type Booking = USER_BOOKINGS_QUERYResult[number];

interface DayBookingsProps {
  bookings: Booking[];
  selectedDate: Date;
}

/**
 * Displays bookings for a selected day.
 * Shows booking cards for an empty state message
 */
export function DayBookings({ bookings, selectedDate }: DayBookingsProps) {
  // Filter bookings for the selected date (exclude cancelled and past)
  const dayBookings = bookings.filter((booking) => {
    if (booking.status === "cancelled") return false;
    if (!booking.classSession?.startTime) return false;

    const classTime = new Date(booking.classSession.startTime);
    if (!isSameDay(classTime, selectedDate)) return false;
    if (isPast(classTime)) return false;

    return true;
  });
  console.log(dayBookings);

  const isTodaySelected = isToday(selectedDate);

  if (dayBookings.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-card p-6 text-center">
        <CalendarIcon className="mb-3 h-8 w-8 text-muted-foreground/50" />
        <h3 className="mb-1 font-medium">
          {isTodaySelected ? "No bookings today" : "No bookings"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isTodaySelected
            ? "You don't have any classes booked for today"
            : `No classes booked for ${format(selectedDate, "MMMM d")}`}
        </p>
        <Link
          href="/classes"
          className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400"
        >
          Browse classes →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3>Day Bookings</h3>
    </div>
  );
}
