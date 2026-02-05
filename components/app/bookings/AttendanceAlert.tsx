"use client";
import { addHours, differenceInMinutes, format } from "date-fns";
import { CheckCircle2Icon, TimerIcon, ZapIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TimeAgo from "react-timeago";
import { Card, CardContent } from "@/components/ui/card";
import { urlFor } from "@/sanity/lib/image";
import type { USER_BOOKINGS_QUERYResult } from "@/sanity.types";
import { BookingActions } from "./BookingActions";

type Booking = USER_BOOKINGS_QUERYResult[number];

interface AttendanceAlertProps {
  bookings: Booking[];
}

/**
 * Alert banner for bookings that need attendance confirmation.
 * Shows when a class is in progress or within 1 hour post-workout window.
 */
export function AttendanceAlert({ bookings }: AttendanceAlertProps) {
  const now = new Date();

  // Find bookings that need attendace confirmation
  const needsAttendance = bookings.filter((booking) => {
    if (booking.status !== "confirmed") return false;
    if (!booking.classSession?.startTime) return false;

    const classStart = new Date(booking.classSession.startTime);
    const duration = booking.classSession.activity?.duration || 60;
    const classEnd = addHours(classStart, duration / 60);
    const attendanceWindowEnd = addHours(classEnd, 1);

    return now >= classStart && now <= attendanceWindowEnd;
  });

  if (needsAttendance.length === 0) {
    return null;
  }

  return (
    <div>
      {needsAttendance.map((booking) => {
        const { classSession } = booking;
        if (!classSession?.startTime) return null;

        const classStart = new Date(classSession.startTime);
        const duration = classSession.activity?.duration ?? 60;
        const classEnd = addHours(classStart, duration / 60);
        const attendanceWindowEnd = addHours(classEnd, 1);
        const isInProgress = now < classEnd;

        // Calculate progress (from class start to attendance window end)
        const totalWindowMinutes = differenceInMinutes(
          attendanceWindowEnd,
          classStart,
        );
        const elapsedMinutes = differenceInMinutes(now, classStart);
        const progressPercent = Math.min(
          100,
          (elapsedMinutes / totalWindowMinutes) * 100,
        );

        return (
          <Card
            key={booking._id}
            className="overflow-hidden border border-teal-200 bg-teal-50/50 shadow-sm dark:border-teal-800/30 dark:bg-teal-950/20"
          >
            {/* In Progress */}
            <div className="h-1 w-full bg-teal-100 dark:bg-teal-900/30">
              <div
                className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                {/* Status Icon */}
                <div className="hidden shrink-0 rounded-2xl bg-teal-100 p-3 text-teal-600 sm:block dark:bg-violet-900/30 dark:text-violet-400">
                  <ZapIcon className="size-7" />
                </div>

                <div className="min-w-0 flex-1 space-y-4">
                  {/* Header Row */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="shrink-0 rounded-xl bg-violet-100 p-2 text-teal-600 sm:hidden dark:bg-teal-900/30 dark:text-teal-400">
                          <ZapIcon className="size-5" />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                          {isInProgress
                            ? "Class in Progress"
                            : "Confirm Attendance"}
                        </h2>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {isInProgress
                          ? "Confirm now or up to 1 hour after this class ends"
                          : "Did you attend? Confirm before the window closes"}
                      </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                      <TimerIcon className="size-4" />
                      <TimeAgo
                        date={attendanceWindowEnd}
                        formatter={(
                          value: number,
                          unit: string,
                          suffix: string,
                        ) =>
                          suffix === "ago"
                            ? "Expired"
                            : `${value} ${unit}${value !== 1 ? "s" : ""} left`
                        }
                      />
                    </div>
                  </div>

                  {/* Warning Notice */}
                  <p className="rounded-lg bg-teal-100/50 px-3 py-2 text-sm text-teal-800 dark:bg-teal-900/20 dark:text-teal-200">
                    <strong>Important:</strong> Unconfirmed bookings are marked
                    as no-shows, which may affect your account standing.
                  </p>

                  {/* Class Card */}
                  <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/classes/${classSession._id}`}
                      className="group flex items-center gap-4"
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted shadow-sm transition-transform group-hover:scale-105">
                        {classSession.activity?.image ? (
                          <Image
                            src={urlFor(classSession.activity.image)
                              .width(112)
                              .height(112)
                              .url()}
                            alt={classSession.activity.name ?? "Class"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            <CheckCircle2Icon className="size-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="rounded-lg bg-teal-100/50 px-3 py-2 text-sm text-teal-800 dark:bg-teal-900/20 dark:text-teal-200">
                          {classSession.activity?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {classSession.venue?.name} •{" "}
                          {format(classStart, "h:mm a")}
                          {isInProgress && (
                            <span className="ml-1 text-violet-600 dark:text-violet-400">
                              → Ends {format(classEnd, "h:mm a")}
                            </span>
                          )}
                        </p>
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <BookingActions
                        bookingId={booking._id}
                        canConfirmAttendance={true}
                        isPast={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
