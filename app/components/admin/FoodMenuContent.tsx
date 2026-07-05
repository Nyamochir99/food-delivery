"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authRequest } from "@/lib/auth-client";
import { handleAdminRequestError } from "@/lib/admin-client";
import { fetchAdminMenuData } from "@/lib/admin-menu-client";
import { formatUsd, parsePriceInput } from "@/lib/format-price";
import { showSuccessToast } from "@/lib/show-app-toast";
import type { AdminCategory, AdminFood } from "@/lib/types/admin-menu";
import { uploadImage, deleteBlobImage, UploadError } from "@/lib/upload-client";
import { isVercelBlobUrl } from "@/lib/blob-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SortableCategoryPills } from "@/app/components/admin/SortableCategoryPills";
import { FoodMenuSkeleton } from "@/app/components/skeletons";

const DishFormRow = ({
  label,
  children,
  align = "center",
}: {
  label: string;
  children: React.ReactNode;
  align?: "center" | "start";
}) => (
  <div className="grid grid-cols-[120px_1fr] items-start gap-4">
    <span
      className={`text-sm font-medium text-[#71717A] ${
        align === "center" ? "self-center" : "pt-2.5"
      }`}
    >
      {label}
    </span>
    <div className="min-w-0">{children}</div>
  </div>
);

export const FoodMenuContent = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [foods, setFoods] = useState<AdminFood[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deletingCategory, setDeletingCategory] = useState(false);

  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<AdminFood | null>(null);
  const [foodName, setFoodName] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [foodCategoryId, setFoodCategoryId] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [savedImageUrl, setSavedImageUrl] = useState("");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [deletingFood, setDeletingFood] = useState(false);
  const [savingFood, setSavingFood] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const totalFoodCount = foods.length;

  const clearPendingImagePreview = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    setPendingImageFile(null);
  };

  const handleImageSelect = (file: File | null | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    clearPendingImagePreview();
    const previewUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = previewUrl;
    setPendingImageFile(file);
    setFoodImage(previewUrl);
  };

  const handleImageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleImageSelect(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingImage(false);
    handleImageSelect(event.dataTransfer.files?.[0]);
  };

  const handleRemoveImage = async () => {
    if (pendingImageFile) {
      clearPendingImagePreview();
      setFoodImage(savedImageUrl);
      return;
    }

    if (!foodImage || !isVercelBlobUrl(foodImage)) {
      setFoodImage("");
      setSavedImageUrl("");
      return;
    }

    try {
      setRemovingImage(true);
      await deleteBlobImage(foodImage);
      setFoodImage("");
      setSavedImageUrl("");
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      toast.error(
        err instanceof UploadError ? err.message : "Failed to delete image",
      );
    } finally {
      setRemovingImage(false);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchAdminMenuData();
      setCategories(data.categories);
      setFoods(data.foods);
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to load admin menu:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    fetchAdminMenuData()
      .then((data) => {
        if (cancelled) return;
        setCategories(data.categories);
        setFoods(data.foods);
      })
      .catch((err) => {
        if (cancelled) return;
        if (handleAdminRequestError(err, router)) return;
        console.error("Failed to load admin menu:", err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const resetFoodForm = () => {
    clearPendingImagePreview();
    setEditingFood(null);
    setFoodName("");
    setFoodPrice("");
    setFoodCategoryId("");
    setIngredients("");
    setFoodImage("");
    setSavedImageUrl("");
  };

  const openAddFoodDialog = (categoryId?: string) => {
    resetFoodForm();
    setFoodCategoryId(categoryId || categories[0]?.id || "");
    setFoodDialogOpen(true);
  };

  const openEditFoodDialog = (food: AdminFood) => {
    clearPendingImagePreview();
    setEditingFood(food);
    setFoodName(food.foodName);
    setFoodPrice(formatUsd(food.price));
    setFoodCategoryId(food.categoryId);
    setIngredients(food.ingredients);
    setSavedImageUrl(food.image);
    setFoodImage(food.image);
    setFoodDialogOpen(true);
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      await authRequest({
        url: "/api/admin/categories",
        method: "POST",
        data: { categoryName: categoryName.trim() },
      });
      setCategoryDialogOpen(false);
      setCategoryName("");
      showSuccessToast("New Category is being added to the menu");
      await loadData();
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to add category:", err);
    }
  };

  const openEditCategoryDialog = (category: AdminCategory) => {
    setEditingCategory(category);
    setEditCategoryName(category.categoryName);
    setEditCategoryDialogOpen(true);
  };

  const resetEditCategoryForm = () => {
    setEditingCategory(null);
    setEditCategoryName("");
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) return;

    try {
      await authRequest({
        url: `/api/admin/categories/${editingCategory.id}`,
        method: "PATCH",
        data: { categoryName: editCategoryName.trim() },
      });
      setEditCategoryDialogOpen(false);
      resetEditCategoryForm();
      showSuccessToast("Category successfully updated.");
      await loadData();
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to update category:", err);
    }
  };

  const handleDeleteCategory = async () => {
    if (!editingCategory) return;

    try {
      setDeletingCategory(true);
      await authRequest({
        url: `/api/admin/categories/${editingCategory.id}`,
        method: "DELETE",
      });

      if (selectedCategoryId === editingCategory.id) {
        setSelectedCategoryId("all");
      }

      setEditCategoryDialogOpen(false);
      resetEditCategoryForm();
      showSuccessToast(
        "Category successfully deleted.",
        "Would you like to undo this action?",
      );
      await loadData();
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to delete category:", err);
    } finally {
      setDeletingCategory(false);
    }
  };

  const handleReorderCategories = async (reorderedCategories: AdminCategory[]) => {
    const previousCategories = categories;
    setCategories(reorderedCategories);

    try {
      await authRequest({
        url: "/api/admin/categories/reorder",
        method: "PATCH",
        data: {
          orderedIds: reorderedCategories.map((category) => category.id),
        },
      });
    } catch (err) {
      setCategories(previousCategories);
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to reorder categories:", err);
      toast.error("Failed to reorder categories");
    }
  };

  const handleSaveFood = async () => {
    if (!foodName.trim() || !foodCategoryId || !foodPrice.trim()) return;

    const price = parsePriceInput(foodPrice);
    if (Number.isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setSavingFood(true);

      let imageUrl = savedImageUrl;
      if (pendingImageFile) {
        imageUrl = await uploadImage(pendingImageFile);
        if (
          editingFood &&
          savedImageUrl &&
          isVercelBlobUrl(savedImageUrl) &&
          savedImageUrl !== imageUrl
        ) {
          try {
            await deleteBlobImage(savedImageUrl);
          } catch (deleteErr) {
            console.error("Failed to delete replaced image:", deleteErr);
          }
        }
      } else if (!foodImage) {
        imageUrl = "";
      }

      if (editingFood) {
        await authRequest({
          url: `/api/admin/foods/${editingFood.id}`,
          method: "PATCH",
          data: {
            foodName,
            price,
            categoryId: foodCategoryId,
            ingredients,
            image: imageUrl,
          },
        });
        showSuccessToast("Dish successfully updated.");
      } else {
        await authRequest({
          url: "/api/admin/foods",
          method: "POST",
          data: {
            foodName,
            price,
            categoryId: foodCategoryId,
            ingredients,
            image: imageUrl,
          },
        });
        showSuccessToast("New dish is being added to the menu");
      }

      setFoodDialogOpen(false);
      resetFoodForm();
      await loadData();
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to save food:", err);
      toast.error(
        err instanceof UploadError ? err.message : "Failed to save food",
      );
    } finally {
      setSavingFood(false);
    }
  };

  const handleDeleteFood = async () => {
    if (!editingFood) return;

    try {
      setDeletingFood(true);
      await authRequest({
        url: `/api/admin/foods/${editingFood.id}`,
        method: "DELETE",
      });
      setFoodDialogOpen(false);
      resetFoodForm();
      showSuccessToast(
        "Dish successfully deleted.",
        "Would you like to undo this action?",
      );
      await loadData();
    } catch (err) {
      if (handleAdminRequestError(err, router)) return;
      console.error("Failed to delete food:", err);
    } finally {
      setDeletingFood(false);
    }
  };

  const visibleCategories =
    selectedCategoryId === "all"
      ? categories
      : categories.filter((category) => category.id === selectedCategoryId);

  const getFoodsByCategory = (categoryId: string) =>
    foods.filter((food) => food.categoryId === categoryId);

  if (loading) {
    return <FoodMenuSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-[20px] bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-[#09090B]">
          Dishes category
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedCategoryId("all")}
            className={`flex h-9 items-center gap-2 rounded-full border px-4 text-sm font-medium transition ${
              selectedCategoryId === "all"
                ? "border-[#EF4444] bg-white text-[#09090B]"
                : "border-[#E4E4E7] bg-white text-[#09090B]"
            }`}
          >
            All Dishes
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#18181B] px-1.5 text-xs text-white">
              {totalFoodCount}
            </span>
          </button>

          <SortableCategoryPills
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
            onEdit={openEditCategoryDialog}
            onReorder={handleReorderCategories}
          />

          <button
            type="button"
            onClick={() => setCategoryDialogOpen(true)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#EF4444] text-white transition hover:bg-[#EF4444]/90"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </section>

      {visibleCategories.length === 0 ? (
        <section className="rounded-[20px] bg-white p-10 text-center">
          <p className="mb-4 text-sm text-[#71717A]">
            No categories yet. Add a category to start building your menu.
          </p>
          <Button
            type="button"
            onClick={() => setCategoryDialogOpen(true)}
            className="rounded-full bg-[#18181B] text-white hover:bg-[#18181B]/90"
          >
            Add category
          </Button>
        </section>
      ) : (
        visibleCategories.map((category) => {
          const categoryFoods = getFoodsByCategory(category.id);

          return (
            <section key={category.id} className="flex flex-col gap-6">
              <h3 className="text-xl font-semibold text-[#09090B]">
                {category.categoryName} ({categoryFoods.length})
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <button
                  type="button"
                  onClick={() => openAddFoodDialog(category.id)}
                  className="flex h-85.5 min-h-85.5 cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-[#EF4444] bg-white p-6 transition hover:bg-[#FFF5F5]"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#EF4444] text-white">
                    <Plus className="size-4" />
                  </span>
                  <span className="text-center text-sm font-medium text-[#09090B]">
                    Add new Dish to {category.categoryName}
                  </span>
                </button>

                {categoryFoods.map((food) => (
                  <div
                    key={food.id}
                    className="flex h-85.5 flex-col gap-5 rounded-[20px] bg-white p-4"
                  >
                    <div
                      className="relative flex h-52.5 w-full items-end justify-end overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat p-5"
                      style={{ backgroundImage: `url(${food.image})` }}
                    >
                      <button
                        type="button"
                        aria-label={`Edit ${food.foodName}`}
                        onClick={() => openEditFoodDialog(food)}
                        className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white transition hover:bg-[#f8f8f8]"
                      >
                        <Pencil className="size-4 text-[#EF4444]" />
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-2xl font-semibold text-[#EF4444]">
                          {food.foodName}
                        </span>
                        <span className="text-lg font-semibold text-[#09090B]">
                          {formatUsd(food.price)}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm font-normal text-[#71717A]">
                        {food.ingredients}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="gap-6 rounded-[20px] p-6 sm:max-w-md">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-xl font-semibold text-[#09090B]">
              Add new category
            </DialogTitle>
            <DialogDescription className="sr-only">
              Create a new dish category
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#09090B]">
              Category name
            </label>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Type category name..."
              className="h-11 rounded-xl border-[#E4E4E7] px-4"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleAddCategory}
              disabled={!categoryName.trim()}
              className="h-11 rounded-full bg-[#18181B] px-6 text-white hover:bg-[#18181B]/90"
            >
              Add category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editCategoryDialogOpen}
        onOpenChange={(open) => {
          setEditCategoryDialogOpen(open);
          if (!open) resetEditCategoryForm();
        }}
      >
        <DialogContent className="gap-6 rounded-[20px] p-6 sm:max-w-md">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-xl font-semibold text-[#09090B]">
              Edit category
            </DialogTitle>
            <DialogDescription className="sr-only">
              Update or delete dish category
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#09090B]">
              Category name
            </label>
            <Input
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              placeholder="Type category name..."
              className="h-11 rounded-xl border-[#E4E4E7] px-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Delete category"
              disabled={deletingCategory}
              onClick={() => void handleDeleteCategory()}
              className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#EF4444] text-[#EF4444] transition hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingCategory ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Trash2 className="size-5" />
              )}
            </button>
            <Button
              type="button"
              onClick={handleUpdateCategory}
              disabled={!editCategoryName.trim() || deletingCategory}
              className="h-11 rounded-full bg-[#18181B] px-6 text-white hover:bg-[#18181B]/90"
            >
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={foodDialogOpen}
        onOpenChange={(open) => {
          setFoodDialogOpen(open);
          if (!open) resetFoodForm();
        }}
      >
        <DialogContent className="max-h-[90vh] gap-6 overflow-y-auto rounded-[20px] p-6 sm:max-w-xl">
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-xl font-semibold text-[#09090B]">
              {editingFood ? "Dishes info" : "Add new Dish"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editingFood ? "Edit dish details" : "Add a new dish to the menu"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <DishFormRow label="Dish name">
              <Input
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="Type food name"
                className="h-11 rounded-xl border-[#E4E4E7] px-4"
              />
            </DishFormRow>

            <DishFormRow label="Dish category">
              <select
                value={foodCategoryId}
                onChange={(e) => setFoodCategoryId(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#E4E4E7] bg-white px-4 text-sm text-[#09090B] outline-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </DishFormRow>

            <DishFormRow label="Ingredients" align="start">
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List ingredients..."
                rows={4}
                className="w-full resize-none rounded-xl border border-[#E4E4E7] px-4 py-3 text-sm text-[#09090B] outline-none placeholder:text-[#71717A]"
              />
            </DishFormRow>

            <DishFormRow label="Price">
              <Input
                value={foodPrice}
                onChange={(e) => {
                  const numeric = e.target.value.replace(/[^0-9.]/g, "");
                  setFoodPrice(numeric ? `$${numeric}` : "");
                }}
                placeholder="$0.00"
                className="h-11 rounded-xl border-[#E4E4E7] px-4"
              />
            </DishFormRow>

            <DishFormRow label="Image" align="start">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageInputChange}
              />
              {foodImage ? (
                <div className="relative w-full">
                  <div
                    className="h-24 w-full rounded-xl bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${foodImage})` }}
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    disabled={removingImage}
                    onClick={() => void handleRemoveImage()}
                    className="absolute -top-2 -right-2 flex size-7 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] bg-white text-[#EF4444] shadow-sm transition hover:bg-[#FFF5F5] disabled:opacity-60"
                  >
                    {removingImage ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <X className="size-4" />
                    )}
                  </button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => imageInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      imageInputRef.current?.click();
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDraggingImage(true);
                  }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={handleImageDrop}
                  className={`flex h-24 w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed bg-[#FAFAFA] text-xs text-[#71717A] transition ${
                    isDraggingImage
                      ? "border-[#EF4444] bg-[#FFF5F5]"
                      : "border-[#E4E4E7]"
                  } ${savingFood ? "pointer-events-none opacity-70" : ""}`}
                >
                  <>
                    <ImageIcon className="size-5" />
                    Choose a file or drag & drop
                  </>
                </div>
              )}
            </DishFormRow>
          </div>

          <div className="flex items-center justify-between pt-2">
            {editingFood ? (
              <button
                type="button"
                aria-label="Delete dish"
                disabled={deletingFood}
                onClick={() => void handleDeleteFood()}
                className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#EF4444] text-[#EF4444] transition hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingFood ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Trash2 className="size-5" />
                )}
              </button>
            ) : (
              <span />
            )}
            <Button
              type="button"
              onClick={handleSaveFood}
              disabled={
                !foodName.trim() ||
                !foodPrice.trim() ||
                !foodCategoryId ||
                deletingFood ||
                savingFood ||
                removingImage
              }
              className="h-11 rounded-full bg-[#18181B] px-6 text-white hover:bg-[#18181B]/90"
            >
              {savingFood ? (
                <Loader2 className="size-5 animate-spin" />
              ) : editingFood ? (
                "Save changes"
              ) : (
                "Add Dish"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
