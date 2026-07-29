import { supabase } from "@/utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Product = {
  product_id: number;
  product_name: string;
  categories?: { category_name: string } | null;
  category_id: number | null;
  unit_price: number;
  units_in_stock: number;
};

export type Category = {
  category_id: number;
  category_name: string;
};

export const PAGE_SIZE = 10;
async function fetchProducts(page: number, sortOrder: "asc" | "desc", categoryId?: string) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select("*, categories:category_id (category_name)", { count: "exact" })
    .order("product_id", { ascending: sortOrder === "asc" })

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { products: data as Product[], total: count ?? 0 };
}

async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw new Error(error.message);
  return data as Category[];
}

async function insertProduct(newProduct: {
  product_name: string;
  category_id: number;
  unit_price: number;
  units_in_stock: number;
}) {
  const { data: maxData, error: maxError } = await supabase
    .from("products")
    .select("product_id")
    .order("product_id", { ascending: false })
    .limit(1)
    .single();

  if (maxError) throw new Error(maxError.message);

  const nextId = (maxData?.product_id ?? 0) + 1;

  const { error } = await supabase.from("products").insert({
    product_id: nextId,
    ...newProduct,
    discontinued: 0,
  });

  if (error) throw new Error(error.message);
}

async function deleteProduct(productId: number) {
  const { error } = await supabase.from("products").delete().eq("product_id", productId);
  if (error) throw new Error(error.message);
}

async function updateProduct({
  id,
  updatedData,
}: {
  id: number;
  updatedData: {
    product_name: string;
    category_id: number;
    unit_price: number;
    units_in_stock: number;
  };
}) {
  const {error} = await supabase
    .from("products")
    .update(updatedData)
    .eq("product_id", id);

  if(error) throw new Error(error.message);
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"]});
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useProductsData(page: number, sortOrder: "asc" | "desc", categoryId?: string) {
  const productsQuery = useQuery({
    queryKey: ["products", page, sortOrder, categoryId],
    queryFn: () => fetchProducts(page, sortOrder, categoryId),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return {
    productsResult: productsQuery.data,
    isLoading: productsQuery.isLoading,
    categories: categoriesQuery.data,
  };
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}