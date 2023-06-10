import { atom, useAtomValue } from "jotai";
import { atomWithReset, atomWithStorage, loadable } from "jotai/utils";
import { activitiesApi } from "./api/activities";
import { Activity } from "./types/activity";
import { Filters } from "./types/filters";
import { Onboarding } from "./types/onboarding";
import { UserIdentity } from "./types/user-identity";

enum StorageKey {
  UserIdentity = "userIdentity",
  FriendIdentities = "friendIdentities",
  Onboarding = "onboarding",
  Likes = "likes",
}

export const usePreloadStoredAtoms = () => {
  useAtomValue(userIdentityAtom);
  useAtomValue(friendIdentitiesAtom);
  useAtomValue(onboardingAtom);
  useAtomValue(likesAtom);
};

export const userIdentityAtom = atomWithStorage<UserIdentity | null>(
  StorageKey.UserIdentity,
  null,
);

export const friendIdentitiesAtom = atomWithStorage<
  Record<string, UserIdentity>
>(StorageKey.FriendIdentities, {});

export const onboardingAtom = atomWithStorage<Onboarding>(
  StorageKey.Onboarding,
  {
    categories: [],
  },
);

export const searchFiltersAtom = atomWithReset<Filters>({
  query: "",
  friendIds: [],
  healthProblems: false,
  preferOnline: false,
  withGrandson: false,
  categories: {
    soul: true,
    mind: true,
    body: true,
  },
  days: {
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: true,
  },
  areas: [] as string[],
});

export const searchResultsAtom = loadable(
  atom<Promise<Activity[] | null>>(async (get) => {
    const userIdentity = get(userIdentityAtom);
    const filters = get(searchFiltersAtom);
    const onboarding = get(onboardingAtom);
    if (!userIdentity) return null;

    const response = await activitiesApi.recommend({
      userId: userIdentity.type === "anonymous" ? "demo" : userIdentity.id,
      filters,
      onboarding,
      ratings: {},
      return_variants: true,
    });

    return response.items;
  }),
);

export const likesAtom = atomWithStorage<Record<string, "liked" | "disliked">>(
  StorageKey.Likes,
  {},
);

export const addFriendDialogOpenAtom = atom(false);
