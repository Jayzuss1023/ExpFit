"use client";

import {
  Search,
  Calendar,
  MapPin,
  Tag,
  CreditCard,
  Lightbulb,
  BookOpen,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  ResultCard,
  type SearchClass,
  type ClassSession,
  type UserBooking,
} from "./ResultCard";
import type { ToolCallPart } from "./types";

// Tool display config
const toolConfig: Record<
  string,
  { label: string; doneLabel: string; icon: typeof Search }
> = {
  searchClasses: {
    label: "Searching classes",
    doneLabel: "Found classes",
    icon: Search,
  },

  getClassSessions: {
    label: "Finding sessions",
    doneLabel: "Found sessions",
    icon: Calendar,
  },
  searchVenues: {
    label: "Searching venues",
    doneLabel: "Found venues",
    icon: MapPin,
  },
  getCategories: {
    label: "Loading categories",
    doneLabel: "Categories loaded",
    icon: Tag,
  },
  getSubscriptionInfo: {
    label: "Getting pricing",
    doneLabel: "Pricing info",
    icon: CreditCard,
  },
  getRecommendations: {
    label: "Finding recommendations",
    doneLabel: "Recommendations",
    icon: Lightbulb,
  },
  getUserBookings: {
    label: "Loading bookings",
    doneLabel: "Your bookings",
    icon: BookOpen,
  },
};

interface ToolCallUIProps {
  toolPart: ToolCallPart;
  closeChat: () => void;
}

export function ToolCallUI({ toolPart, closeChat }: ToolCallUIProps) {
  const toolName = toolPart.toolName || toolPart.type.replace("tool-", "");

  const config = toolConfig[toolName] || {
    label: "Processing",
    doneLabel: "Done",
    icon: Loader2,
  };
  const Icon = config.icon;

  const isComplete =
    toolPart.state === "output-available" ||
    toolPart.state === "result" ||
    toolPart.output !== undefined ||
    toolPart.result !== undefined;
  const result = toolPart.output ?? toolPart.result;

  // Get items array from result (handles classes, sessions, venues, bookings, recommendations)
  const items =
    result?.classes ??
    result?.sessions ??
    result?.venues ??
    result?.bookings ??
    result?.recommendations ??
    [];
  const itemsArray = Array.isArray(items) ? items : [];
  console.log(items);

  return (
    <div>
      {/* Status Indicator */}
      <div>
        <div>
          <Icon
            className={`h-4 w-4 ${
              isComplete
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
