import { getMenuCategories } from "@/lib/menu";
import { FoodList } from "./FoodList";

export const MenuContainer = async () => {
  const categories = await getMenuCategories();

  if (categories.length === 0) {
    return (
      <div className="flex w-full justify-center py-22">
        <p className="text-lg text-white/80">Menu is being prepared. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-13.5 py-22">
      {categories.map((category) => (
        <FoodList
          key={category.id}
          categoryId={category.id}
          categoryName={category.categoryName}
          foods={category.foods}
        />
      ))}
    </div>
  );
};
