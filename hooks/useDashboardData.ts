import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchDashboardData = async (year: string) => {
  let query = supabase
    .from("orders")
    .select(`
      order_date,
      ship_country,
      customer_id,
      order_details (
        product_id,
        unit_price,
        quantity,
        discount
      )
    `);

  if (year !== "all") {
    query = query
      .gte("order_date", `${year}-01-01`)
      .lte("order_date", `${year}-12-31`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export function useDashboardData(selectedYear: string) {
  return useQuery({
    queryKey: ["dashboardData", selectedYear],
    queryFn: () => fetchDashboardData(selectedYear),
  });
}