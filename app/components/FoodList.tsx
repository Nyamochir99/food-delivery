import { Card } from "./Card";
import type { FoodItem } from "./FoodDetailDialog";

type FoodListProps = {
  categoryId: string;
  categoryName: string;
  foods: FoodItem[];
};

export const FoodList = ({ categoryId, categoryName, foods }: FoodListProps) => {
  if (foods.length === 0) return null;

  return (
    <div
      id={`category-${categoryId}`}
      className="flex w-full scroll-mt-32 justify-center"
    >
      <div className="flex w-7xl flex-col gap-13.5">
        <div className="text-3xl font-semibold text-white">{categoryName}</div>
        <div className="grid grid-cols-3 gap-9">
          {foods.map((food) => (
            <Card key={food.id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
};
