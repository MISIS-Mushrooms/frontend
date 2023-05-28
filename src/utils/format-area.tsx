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
