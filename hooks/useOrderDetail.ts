import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/hooks/useOrdersData";

export type OrderDetailItem = {
  order_id: number;
  product_id: number;
  unit_price: number;
  quantity: number;
  discount: number;
  products: { product_name: string } | null;
};

export type OrderCustomer = {
  company_name: string;
  contact_name: string;
  phone: string;
  city: string;
  country: string;
};

export type OrderDetailResult = {
  order: Order;
  customer: OrderCustomer | null;
  items: OrderDetailItem[];
};

async function fetchOrderDetail(orderId: number): Promise<OrderDetailResult> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (orderError) throw new Error(orderError.message);

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("company_name, contact_name, phone, city, country")
    .eq("customer_id", order.customer_id)
    .maybeSingle();

  if (customerError) throw new Error(customerError.message);

  const { data: items, error: itemsError } = await supabase
    .from("order_details")
    .select(
      "order_id, product_id, unit_price, quantity, discount, products:product_id (product_name)"
    )
    .eq("order_id", orderId);

  if (itemsError) throw new Error(itemsError.message);

  const normalizedItems: OrderDetailItem[] = (items ?? []).map((item) => {
    const productRelation = item.products;
    const product = Array.isArray(productRelation)
      ? productRelation[0] ?? null
      : productRelation;

    return {
      order_id: item.order_id,
      product_id: item.product_id,
      unit_price: item.unit_price,
      quantity: item.quantity,
      discount: item.discount,
      products: product,
    };
  });

  return {
    order: order as Order,
    customer: customer as OrderCustomer | null,
    items: normalizedItems,
  };
}

export function useOrderDetail(orderId: number | null) {
  return useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: () => fetchOrderDetail(orderId!),
    enabled: orderId !== null,
  });
}
