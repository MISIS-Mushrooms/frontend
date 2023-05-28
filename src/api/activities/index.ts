import type { Activity } from "src/types/activity";
import { Filters } from "src/types/filters";

class ActivitiesApi {
  async identify(params: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
  }): Promise<{
    userId: string;
    needOnboarding: boolean;
    areas: string[];
  }> {
    const response = await fetch(`/api/identify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return response.json();
  }

  async somebody(): Promise<{
    lastName: string;
    firstName: string;
    middleName: string;
    dateOfBirth: string;
  }> {
    const response = await fetch(`/api/somebody`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    return response.json();
  }

  async recommend(params: {
    userId: string;
    filters: Filters;
    onboarding: {
      categories: string[];
    };
    return_variants: boolean;
  }): Promise<{
    items: Activity[];
  }> {
    const response = await fetch(`/api/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return response.json();

    /* await sleep(1000);
    return deepCopy(activities); */
  }
}

export const activitiesApi = new ActivitiesApi();
