import { Activity } from "./activity";

export type UserIdentity = {
  type: "authenticated" | "anonymous";
  id: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  dateOfBirth: string;
  needOnboarding: boolean;
  areas: string[];
  history: (Pick<
    Activity,
    "id" | "category1" | "category2" | "category3" | "description"
  > & {
    variant: {
      id: string;
      visitedAt: string;
    };
  })[];
};
