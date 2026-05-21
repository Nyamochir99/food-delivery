import React from "react";
import { FoodList } from "./FoodList";

export const MenuContainer = () => {
  return (
    <div className="py-22 w-full flex flex-col gap-13.5 items-center">
      <FoodList category="Appetizers" />
      <FoodList category="Salads" />
      <FoodList category="Lunch favorites" />
      <FoodList category="Deserts" />
    </div>
  );
};
