export const pluralizeRussianNoun = (
  count: number,
  single: string,
  twoToFour: string,
  fiveToZero: string,
) => {
  const countEnding = count % 10;
  return ((count - countEnding) / 10) % 10 != 1
    ? countEnding != 1
      ? [2, 3, 4].includes(countEnding)
        ? twoToFour
        : fiveToZero
      : single
    : fiveToZero;
};
