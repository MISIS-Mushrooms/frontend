import { incline } from "lvovich";
import { DeclentionStrT } from "lvovich/lib/inclineRules";
import { diff, sift } from "radash";
import { Weekday, WEEKDAYS } from "src/types/weekdays";

export const formatWeekday = (day: Weekday, long?: boolean) => {
  if (day === "mon") {
    return long ? "Понедельник" : "Пн";
  } else if (day === "tue") {
    return long ? "Вторник" : "Вт";
  } else if (day === "wed") {
    return long ? "Среда" : "Ср";
  } else if (day === "thu") {
    return long ? "Четверг" : "Чт";
  } else if (day === "fri") {
    return long ? "Пятница" : "Пт";
  } else if (day === "sat") {
    return long ? "Суббота" : "Сб";
  } else if (day === "sun") {
    return long ? "Воскресенье" : "Вс";
  }
};

export const formatWeekdayList = (days: Weekday[]) => {
  if (days.length === 7) {
    return;
  }

  return days.length <= 3
    ? days.map((d) => formatWeekday(d)).join(", ")
    : "Кроме " +
        diff(WEEKDAYS, days)
          .map((d) => formatWeekday(d))
          .join(", ");
};

export const formatActivityTime = (time: string) => {
  return time.replaceAll(" ", "").replaceAll(":", "∶").replaceAll("-", "–");
};

export const formatActivityTitle = (title: string) => {
  return title.replace("ОНЛАЙН ", "");
};

export const formatPersonName = (
  last: string | null,
  first: string,
  middle: string | null,
  declension?: DeclentionStrT,
) => {
  if (declension) {
    const inclined = incline({ last, first, middle }, declension);
    if (inclined.last) last = inclined.last;
    if (inclined.first) first = inclined.first;
    if (inclined.middle) middle = inclined.middle;
  }
  return sift([last, first, middle]).join(" ");
};

export function formatArea(area: string[], distance?: number) {
  let name = area
    .map((s) => s.replaceAll("муниципальный округ ", ""))
    .join(", ");

  if (distance) {
    let displayDistance = Math.floor(distance / 100) * 100;
    let units = "м";

    if (distance >= 1000) {
      displayDistance /= 1000;
      units = "км";
    }

    name += ` (${displayDistance} ${units})`;
  }

  return name;
}
