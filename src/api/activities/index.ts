import type { Activity } from "src/types/activity";
import { Filters } from "src/types/filters";
import { UserIdentity } from "src/types/user-identity";

type IdentifyParams =
  | {
      firstName: string;
      middleName: string;
      lastName: string;
      dateOfBirth: string;
    }
  | {
      userId: string;
    };

type IdentifyResponse = Pick<
  UserIdentity,
  "areas" | "needOnboarding" | "history"
> & {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
};

type SomebodyResponse = {
  lastName: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
};

type RecommendParams = {
  userId: string;
  filters: Filters;
  onboarding: {
    categories: string[];
  };
  ratings: {
    [itemId: string]: "liked" | "disliked";
  };
  return_variants: boolean;
};

type RecommendResponse = {
  items: Activity[];
};

class ActivitiesApi {
  async identify(params: IdentifyParams): Promise<IdentifyResponse> {
    const response = await fetch(`/api/identify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const json = (await response.json()) as IdentifyResponse;

    json.history.reverse(); // HACK

    return json;
  }

  async somebody(): Promise<SomebodyResponse> {
    const response = await fetch(`/api/somebody`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    return response.json();
  }

  async recommend(params: RecommendParams): Promise<RecommendResponse> {
    const response = await fetch(`/api/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const json = (await response.json()) as RecommendResponse;

    // Add example promo activity
    json.items.unshift({
      id: "-6666539473595712633_promo",
      category1: "Физическая активность",
      category2: "Гимнастика",
      category3: "Йога",
      description:
        "Занятия по изучению физических упражнений, включающих в себя различные духовные, психические и физические практики, направленные на управление психическим и физиологическим состоянием.",
      tags: {
        promo: true,
        category: "body",
        smallGroups: false,
        nextHouse: false,
        new: false,
        online: false,
      },
      variants: [
        {
          id: "801370667",
          area: ["муниципальный округ Таганский"],
          distance: 9323.416908044645,
          timetable: {
            mon: "10:00-11:00",
            tue: "нет",
            wed: "нет",
            thu: "10:00-11:00",
            fri: "нет",
            sat: "нет",
            sun: "нет",
          },
        },
        {
          id: "801370219",
          area: ["муниципальный округ Южнопортовый"],
          distance: 9750.878292374535,
          timetable: {
            mon: "12:00-13:00",
            tue: "нет",
            wed: "12:00-13:00",
            thu: "нет",
            fri: "нет",
            sat: "нет",
            sun: "нет",
          },
        },
        {
          id: "801366333",
          area: ["муниципальный округ Южнопортовый"],
          distance: 9750.878292374535,
          timetable: {
            mon: "16:00-17:00",
            tue: "нет",
            wed: "16:00-17:00",
            thu: "нет",
            fri: "нет",
            sat: "нет",
            sun: "нет",
          },
        },
      ],
    });

    return json;
  }
}

export const activitiesApi = new ActivitiesApi();
