"use client";

import { startOfToday } from "date-fns";
import { useState } from "react";
import type { USER_BOOKINGS_QUERYResult } from "@/sanity.types";
import { BookingsCalendar } from "./BookingsCalendar";
import { DayBookings } from "./DayBookings";

interface BookingsCalendarViewProps {
  bookings: USER_BOOKINGS_QUERYResult;
}

/**
 * Combined calendar view with day selection and booking display.
 * This client component manages the selected date state.
 */
export function BookingsCalendarView({ bookings }: BookingsCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(320px,400px)_1fr]">
      {/* Calendar */}
      <div>
        <BookingsCalendar
          bookings={bookings}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      {/* Selected Day's Bookings */}
      <div>
        <DayBookings bookings={bookings} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
