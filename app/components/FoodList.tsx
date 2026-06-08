import React from "react";
import { Card } from "./Card";
import type { FoodItem } from "./FoodDetailDialog";

const sampleFoods: FoodItem[] = [
  {
    id: "1",
    name: "Sunshine Stackers",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
    price: 12.99,
    image: "https://placehold.co/366x210",
  },
  {
    id: "2",
    name: "Sunshine Stackers",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
    price: 12.99,
    image: "https://placehold.co/366x210",
  },
  {
    id: "3",
    name: "Sunshine Stackers",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
    price: 12.99,
    image: "https://placehold.co/366x210",
  },
  {
    id: "4",
    name: "Sunshine Stackers",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
    price: 12.99,
    image: "https://placehold.co/366x210",
  },
  {
    id: "5",
    name: "Sunshine Stackers",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
    price: 12.99,
    image: "https://placehold.co/366x210",
  },
  {
    id: "6",
    name: "Sunshine Stackers",
    description:
      "Fluffy pancakes stacked with fruits, cream, syrup, and powdered sugar.",
    price: 12.99,
    image: "https://placehold.co/366x210",
  },
];

export const FoodList = ({ category }: { category: string }) => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-7xl flex-col gap-13.5">
        <div className="text-3xl font-semibold text-white">{category}</div>
        <div className="grid grid-cols-3 gap-9">
          {sampleFoods.map((food) => (
            <Card key={food.id} food={food} />
          ))}
        </div>
      </div>
    </div>
  );
};
