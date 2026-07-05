export const categoryWithCountInclude = {
  _count: { select: { foods: true } },
} as const;

export const validateCategoryName = (categoryName: unknown) => {
  if (typeof categoryName !== "string" || !categoryName.trim()) {
    return {
      error: { message: "Category name is required" },
      status: 400 as const,
    };
  }

  return { value: categoryName.trim() };
};
