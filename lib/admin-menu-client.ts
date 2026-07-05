import { authRequest } from "@/lib/auth-client";
import type { AdminCategory, AdminFood } from "@/lib/types/admin-menu";

export const fetchAdminMenuData = async () => {
  const [categoriesRes, foodsRes] = await Promise.all([
    authRequest<{ categories: AdminCategory[] }>({
      url: "/api/admin/categories",
      method: "GET",
    }),
    authRequest<{ foods: AdminFood[] }>({
      url: "/api/admin/foods",
      method: "GET",
    }),
  ]);

  return {
    categories: categoriesRes.data.categories,
    foods: foodsRes.data.foods,
  };
};
