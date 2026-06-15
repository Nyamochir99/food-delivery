import type { FoodItem } from "@/app/components/FoodDetailDialog";

type DbFood = {
  id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
};

export const mapFoodToItem = (food: DbFood): FoodItem => ({
  id: food.id,
  name: food.foodName,
  description: food.ingredients,
  price: food.price,
  image: food.image,
});
