export type AdminCategory = {
  id: string;
  categoryName: string;
  _count: { foods: number };
};

export type AdminFood = {
  id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  categoryId: string;
  category: {
    id: string;
    categoryName: string;
  };
};
