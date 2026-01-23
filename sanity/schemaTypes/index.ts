import type { SchemaTypeDefinition } from "sanity";
import { activityType } from "./activityType";
import { bookingType } from "./bookingType";
import { categoryType } from "./categoryType";
import { classSessionType } from "./classSessionType";
import { userProfileType } from "./userProfileTypes";
import { venueType } from "./venueType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userProfileType,
    categoryType,
    activityType,
    classSessionType,
    venueType,
    bookingType,
  ],
};
