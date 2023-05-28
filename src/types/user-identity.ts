export type UserIdentity = {
  type: "authenticated" | "anonymous";
  id: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  dateOfBirth: string;
  needOnboarding: boolean;
  areas: string[];
};
