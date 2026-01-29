import type { SchemaTypeDefinition } from "sanity";
import { activityType } from "./activityType";
import { bookingType } from "./bookingType";
import { categoryType } from "./categoryType";
import { classSessionType } from "./classSessionType";
import { userProfileType } from "./userProfileType";
import { venueType } from "./venueType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userProfileType,
    venueType,
    categoryType,
    activityType,
    classSessionType,
    bookingType,
  ],
};
