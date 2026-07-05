export const formatDateParts = (
  date: Date,
  separator: "/" | "-" = "/",
) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${separator}${month}${separator}${day}`;
};

export const formatInputDate = (date: Date) => formatDateParts(date, "-");

export const createDefaultDateRange = (days = 30) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return {
    start: formatInputDate(start),
    end: formatInputDate(end),
  };
};

export const parseOrderFilterDate = (value: string | null, endOfDay = false) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date;
};
