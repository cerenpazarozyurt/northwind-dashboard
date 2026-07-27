"use client";

import { Box, Flex, Text, Select, createListCollection, Spinner } from "@chakra-ui/react"
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { 
  calculateTotalRevenue, 
  calculateTotalCustomers, 
  calculateTotalProducts, 
  calculateMonthlyRevenue, 
  calculatePieData 
} from "../../helpers/dashboardHelpers";

const years = createListCollection({
  items: [
    { label: "Tümü", value: "all" },
    { label: "1996", value: "1996" },
    { label: "1997", value: "1997" },
    { label: "1998", value: "1998" },
  ],
});

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("all");

  const { data: rawData, isLoading, error } = useDashboardData(selectedYear);

  const totalOrders = rawData?.length || 0;
  const totalRevenue = calculateTotalRevenue(rawData);
  const totalCustomers = calculateTotalCustomers(rawData);
  const totalProducts = calculateTotalProducts(rawData);
  const monthlyRevenue = calculateMonthlyRevenue(rawData);
  const pieData = calculatePieData(rawData);

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

  if (isLoading) {
  return (
    <Flex justify="center" py={20}>
      <Spinner size="lg" />
    </Flex>
  );
}

if (error) {
  return (
    <Box p={8}>
      <Text color="red.500">Hata: {error.message}</Text>
    </Box>
  );
}

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