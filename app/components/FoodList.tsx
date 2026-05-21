import React from "react";
import { Card } from "./Card";

export const FoodList = ({ category }: { category: string }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-7xl flex flex-col gap-13.5">
        <div className="text-3xl font-semibold text-white">{category}</div>
        <div className="grid grid-cols-3 gap-9">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};
