export const formatActivityDay = (day: string) => {
  if (day === "mon") {
    return "Пн";
  } else if (day === "tue") {
    return "Вт";
  } else if (day === "wed") {
    return "Ср";
  } else if (day === "thu") {
    return "Чт";
  } else if (day === "fri") {
    return "Пт";
  } else if (day === "sat") {
    return "Сб";
  } else if (day === "sun") {
    return "Вс";
  }
  return day;
};

export const formatActivityTime = (time: string) => {
  return time.replaceAll(" ", "").replaceAll(":", "∶").replaceAll("-", "–");
};

export const formatActivityTitle = (title: string) => {
  return title.replace("ОНЛАЙН ", "");
};

export const formatPersonName = (
  lastName: string,
  firstName: string,
  middleName?: string,
) => {
  return `${lastName} ${firstName}${middleName ? ` ${middleName}` : ""}`;
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
