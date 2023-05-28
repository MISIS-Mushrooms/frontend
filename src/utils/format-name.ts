export const formatName = (
  lastName: string,
  firstName: string,
  middleName?: string,
) => {
  return `${lastName} ${firstName}${middleName ? ` ${middleName}` : ""}`;
};
