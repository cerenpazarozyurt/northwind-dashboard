import { supabase } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { COUNTRY_TO_ISO } from "@/helpers/regionHelpers";

export type RegionPoint = {
  "iso-a2": string;
  name: string;
  value: number;
  avgDeliveryDays: number | null;
};

async function fetchRegionData(): Promise<RegionPoint[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("ship_country, order_date, shipped_date");

  if (error) throw new Error(error.message);

  //bir ülkenin kaç siparişi var onu hesaplamak için
  const countryStats: Record<string, { count: number; totalDays: number; validCount: number }> = {};

  data.forEach((order) => {
    const country = order.ship_country;
    if (!country) return;

    if (!countryStats[country]) {
      countryStats[country] = { count: 0, totalDays: 0, validCount: 0 };
    }

    countryStats[country].count += 1;

    // Kargo süresi hesabı
    if (order.order_date && order.shipped_date) {
      const orderDate = new Date(order.order_date).getTime();
      const shippedDate = new Date(order.shipped_date).getTime();
      const diffDays = Math.round((shippedDate - orderDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0) {
        countryStats[country].totalDays += diffDays;
        countryStats[country].validCount += 1;
      }
    }
  });

  //ülke isimlerini diziye çevirip ISO da var mı kontrol yoksa ele
  const regionPoints: RegionPoint[] = Object.entries(countryStats)
    .filter(([country]) => COUNTRY_TO_ISO[country])
    .map(([country, stats]) => {
      const avgDays = stats.validCount > 0 ? Math.round(stats.totalDays / stats.validCount) : null; //ort.kargo süresi
      return {
        "iso-a2": COUNTRY_TO_ISO[country],
        name: country,
        value: stats.count,
        avgDeliveryDays: avgDays,
      };
    });

  return regionPoints;
}

export function useRegionData() {
  return useQuery({
    queryKey: ["regionData"],
    queryFn: fetchRegionData,
  });
}