"use client";

import { Box, Flex, Text, Select, createListCollection } from "@chakra-ui/react"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { supabase } from "@/utils/supabase/client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const years = createListCollection({
  items: [
    { label: "Tümü", value: "all" },
    { label: "1996", value: "1996" },
    { label: "1997", value: "1997" },
    { label: "1998", value: "1998" },
  ],
});

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

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("all");

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ["dashboardData", selectedYear],
    queryFn: () => fetchDashboardData(selectedYear),
  });

  // Toplam Ciro Hesaplama
  const totalOrders = rawData?.length || 0;

  const totalRevenue = rawData?.reduce((acc, order) => { //reduce, tüm elemanları gezer tek bir değer çıkarır.

    const orderTotal = order.order_details?.reduce((sum, item) => {  
      const price = item.unit_price || 0;
      const qty = item.quantity || 0;
      const discount = item.discount || 0;
      return sum + price * qty * (1 - discount);
    }, 0) || 0;

    return acc + orderTotal;
  }, 0) || 0;

  //Toplam Müşteri Sayısı
  const uniqueCustomers = new Set();
  rawData?.forEach((order) => {
    if (order.customer_id) {
      uniqueCustomers.add(order.customer_id);
    }
  });
  const totalCustomers = uniqueCustomers.size; 

  //Aktif Ürün Sayısı
  const uniqueProducts = new Set();
  rawData?.forEach((order) => {
    order.order_details?.forEach((item) => {
      if (item.product_id) {
        uniqueProducts.add(item.product_id);
      }
    });
  });
  const totalProducts = uniqueProducts.size;

  // 12 ayın ciro toplamını 0 olarak ayarla
  const monthlyRevenue = Array(12).fill(0); 

  rawData?.forEach((order) => {
    const monthIndex = new Date(order.order_date).getMonth();

    const orderTotal = order.order_details?.reduce((sum, item) => {
      const price = item.unit_price || 0;
      const qty = item.quantity || 0;
      const discount = item.discount || 0;
      return sum + price * qty * (1 - discount);
    }, 0) || 0;

    monthlyRevenue[monthIndex] += orderTotal;
  });

  //pie chart
  const countrySales: Record<string, number> = {};

  rawData?.forEach((order) => {
    const country = order.ship_country;
    if (country) {
      countrySales[country] = (countrySales[country] || 0) + 1;
    }
  });

  const pieData = Object.entries(countrySales)
    .map(([countryName, count]) => ({
      name: countryName,
      y: count as number,
    }))
    .sort((a, b) => b.y - a.y)
    .slice(0, 5);


  const chartOptions = {
    title: { text: "Aylık Ciro" },
    xAxis: { 
      categories: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"] 
    },
    series: [
      { 
        name: "Ciro ($)", 
        data: monthlyRevenue
      }
    ],
  };

  const pieOptions = {
    chart: { type: "pie" },
    title: { text: "En Çok Satış Yapılan Ülkeler" },
    series: [
      {
        name: "Sipariş Sayısı",
        colorByPoint: true,
        data: pieData,
      },
    ],
  };

  return (
    <Box>
      <Flex gap={4}>
        <Box
          bg="white"
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          flex="1"
        >
          <Text fontSize="sm" color="gray.500" mb={1}>
            Toplam Ciro
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            ${totalRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </Box>

          <Box
          bg="white"
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          flex="1"
        >
          <Text fontSize="sm" color="gray.500" mb={1}>
            Toplam Sipariş Sayısı
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {totalOrders}
          </Text>
        </Box>

        <Box
          bg="white"
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          flex="1"
        >
          <Text fontSize="sm" color="gray.500" mb={1}>
            Toplam Müşteri
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {totalCustomers}
          </Text>
        </Box>

        <Box
          bg="white"
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          flex="1"
        >
          <Text fontSize="sm" color="gray.500" mb={1}>
            Aktif Ürün Sayısı
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {totalProducts}
          </Text>
        </Box>
      </Flex>

      <Flex gap={3} justify="flex-end" mt={6} mr={8}>
      <Select.Root collection={years} size="sm" width="150px" value={[selectedYear]} 
        onValueChange={(e) => {
          if (e.value[0]) setSelectedYear(e.value[0]);
        }} 
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger borderColor="gray.300">
            <Select.ValueText placeholder="Yıl seç" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content bg="white" color="gray.800">
            {years.items.map((year) => (
              <Select.Item item={year} key={year.value}>
                {year.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      </Flex>

      <Flex gap={4} mt={6}>
        <Box flex="1">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
        <Box flex="1">
          <HighchartsReact highcharts={Highcharts} options={pieOptions} />
        </Box>
      </Flex>
    </Box>
  );
}