export const formatUsd = (value: number) => `$${value.toFixed(2)}`;

export const parsePriceInput = (value: string) =>
  Number(value.replace(/[^0-9.]/g, ""));
