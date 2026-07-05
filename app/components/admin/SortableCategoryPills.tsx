"use client";

import { useState } from "react";
import { GripVertical, Pencil } from "lucide-react";
import type { AdminCategory } from "@/lib/types/admin-menu";

type SortableCategoryPillsProps = {
  categories: AdminCategory[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
  onEdit: (category: AdminCategory) => void;
  onReorder: (categories: AdminCategory[]) => void;
};

export const SortableCategoryPills = ({
  categories,
  selectedCategoryId,
  onSelect,
  onEdit,
  onReorder,
}: SortableCategoryPillsProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart =
    (index: number) => (event: React.DragEvent<HTMLButtonElement>) => {
      setDraggedIndex(index);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));
    };

  const handleDragOver =
    (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setDragOverIndex(index);
    };

  const handleDrop = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOverIndex(null);

    const fromIndex =
      draggedIndex ?? Number(event.dataTransfer.getData("text/plain"));
    if (Number.isNaN(fromIndex) || fromIndex === index) {
      setDraggedIndex(null);
      return;
    }

    const reordered = [...categories];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(index, 0, moved);
    onReorder(reordered);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      {categories.map((category, index) => (
        <div
          key={category.id}
          onDragOver={handleDragOver(index)}
          onDrop={handleDrop(index)}
          onDragLeave={() => setDragOverIndex(null)}
          onDragEnd={handleDragEnd}
          className={`group relative transition ${
            draggedIndex === index ? "opacity-50" : ""
          } ${dragOverIndex === index ? "scale-[1.02]" : ""}`}
        >
          <div
            className={`flex h-9 items-center gap-1 rounded-full border text-sm font-medium transition ${
              selectedCategoryId === category.id
                ? "border-[#EF4444] bg-white text-[#09090B]"
                : "border-[#E4E4E7] bg-white text-[#09090B]"
            }`}
          >
            <button
              type="button"
              draggable
              aria-label={`Reorder ${category.categoryName}`}
              onDragStart={handleDragStart(index)}
              onDragEnd={handleDragEnd}
              className="flex cursor-grab items-center px-2 text-[#71717A] active:cursor-grabbing"
            >
              <GripVertical className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSelect(category.id)}
              className="flex items-center gap-2 pr-4"
            >
              {category.categoryName}
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#18181B] px-1.5 text-xs text-white">
                {category._count.foods}
              </span>
            </button>
          </div>
          <button
            type="button"
            aria-label={`Edit ${category.categoryName}`}
            onClick={() => onEdit(category)}
            className="absolute -top-1.5 -right-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#EF4444] opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-[#FFF5F5]"
          >
            <Pencil className="size-3" />
          </button>
        </div>
      ))}
    </>
  );
};
