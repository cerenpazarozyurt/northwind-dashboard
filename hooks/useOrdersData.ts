import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type Order = {
  order_id: number;
  customer_id: string;
  employee_id: number;
  order_date: string;
  required_date: string;
  shipped_date: string | null;
  ship_via: number;
  freight: number;
  ship_name: string;
  ship_address: string;
  ship_city: string;
  ship_region: string;
  ship_postal_code: string;
  ship_country: string;
};

const PAGE_SIZE = 10;

async function fetchOrders(country: string, search: string, page: number) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .range(from, to);

  if (country) {
    query = query.eq("ship_country", country);
  }

  if (search) {
    query = query.ilike("customer_id", `%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { orders: data as Order[], total: count ?? 0 };
}

async function fetchCountries() {
  const { data, error } = await supabase.from("orders").select("ship_country");
  if (error) throw new Error(error.message);
  const uniqueCountries = [...new Set(data.map((row) => row.ship_country))];
  return uniqueCountries;
}

export function useOrdersData(country: string, search: string, page: number) {
  const ordersQuery = useQuery({
    queryKey: ["orders", country, search, page],
    queryFn: () => fetchOrders(country, search, page),
  });

  const countriesQuery = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  return {
    ordersResult: ordersQuery.data,
    isLoading: ordersQuery.isLoading,
    countryList: countriesQuery.data,
  };
}