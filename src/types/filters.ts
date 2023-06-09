import { Weekday } from "./weekdays";

export type Filters = {
  query: string;
  friendIds: string[];
  healthProblems: boolean;
  preferOnline: boolean;
  withGrandson: boolean;
  categories: {
    soul: boolean;
    mind: boolean;
    body: boolean;
  };
  days: {
    [weekday in Weekday]: boolean;
  };
  areas: string[];
};
