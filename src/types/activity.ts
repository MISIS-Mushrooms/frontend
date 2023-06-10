import { Weekday } from "./weekdays";

export type Activity = {
  id: string;
  description: string;
  category1: string;
  category2: string;
  category3: string;
  tags: ActivityTags;
  variants: ActivityVariant[];
};

export type ActivityTags = {
  promo: boolean;
  online: boolean;
  category: "mind" | "soul" | "body";
  smallGroups: boolean;
  nextHouse: boolean;
  new: boolean;
};

export type ActivityVariant = {
  id: string;
  area: string[];
  distance: number;
  timetable: ActivityVariantTimetable;
};

export type ActivityVariantTimetable = {
  [weekday in Weekday]?: string;
};
