import { prisma } from "@/lib/prisma";
import { mapFoodToItem } from "@/lib/food";

export const getMenuCategories = async () => {
  const categories = await prisma.foodCategory.findMany({
    include: {
      foods: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return categories
    .filter((category) => category.foods.length > 0)
    .map((category) => ({
      id: category.id,
      categoryName: category.categoryName,
      foods: category.foods.map(mapFoodToItem),
    }));
};

export const getFooterCategories = async () => {
  return prisma.foodCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      categoryName: true,
    },
  });
};
