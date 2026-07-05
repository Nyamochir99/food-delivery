type FoodPayload = {
  foodName: string;
  categoryId: string;
  price: number;
  image: string;
  ingredients: string;
};

export const validateFoodPayload = (body: {
  foodName?: unknown;
  categoryId?: unknown;
  price?: unknown;
  image?: unknown;
  ingredients?: unknown;
}) => {
  if (typeof body.foodName !== "string" || !body.foodName.trim()) {
    return {
      error: { message: "Food name is required" },
      status: 400 as const,
    };
  }

  if (!body.categoryId || typeof body.categoryId !== "string") {
    return {
      error: { message: "Category is required" },
      status: 400 as const,
    };
  }

  const price = Number(body.price);
  if (Number.isNaN(price) || price <= 0) {
    return {
      error: { message: "Invalid price" },
      status: 400 as const,
    };
  }

  const payload: FoodPayload = {
    foodName: body.foodName.trim(),
    categoryId: body.categoryId,
    price,
    image:
      typeof body.image === "string" && body.image.trim()
        ? body.image.trim()
        : "https://placehold.co/366x210",
    ingredients:
      typeof body.ingredients === "string" ? body.ingredients.trim() : "",
  };

  return { value: payload };
};
