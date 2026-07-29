"use client";

import { Box, Flex, Text, Select, createListCollection, Spinner, SimpleGrid, Stack } from "@chakra-ui/react";
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
    chart: { backgroundColor: "transparent" },
    title: { text: "Aylık Ciro", style: { color: "#e5e7eb" } },
    xAxis: { 
      categories: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
      labels: { style: { color: "#9ca3af" } }
    },
    yAxis: { title: { text: "" }, labels: { style: { color: "#9ca3af" } } },
    series: [
      { 
        name: "Ciro ($)", 
        data: monthlyRevenue,
        color: "#3b82f6"
      }
    ],
  };

  const pieOptions = {
    chart: { type: "pie", backgroundColor: "transparent" },
    title: { text: "En Çok Satış Yapılan Ülkeler", style: { color: "#e5e7eb" } },
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
        <Text color="red.400">Hata: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box w="full" minW="0">
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4} w="full">
        <Box
          bg="gray.900"
          p={5}
          borderRadius="lg"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.800"
        >
          <Text fontSize="sm" color="gray.400" mb={1}>
            Toplam Ciro
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            ${totalRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </Box>

        <Box
          bg="gray.900"
          p={5}
          borderRadius="lg"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.800"
        >
          <Text fontSize="sm" color="gray.400" mb={1}>
            Toplam Sipariş Sayısı
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            {totalOrders}
          </Text>
        </Box>

        <Box
          bg="gray.900"
          p={5}
          borderRadius="lg"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.800"
        >
          <Text fontSize="sm" color="gray.400" mb={1}>
            Toplam Müşteri
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            {totalCustomers}
          </Text>
        </Box>

        <Box
          bg="gray.900"
          p={5}
          borderRadius="lg"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.800"
        >
          <Text fontSize="sm" color="gray.400" mb={1}>
            Aktif Ürün Sayısı
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            {totalProducts}
          </Text>
        </Box>
      </SimpleGrid>

      <Flex justify={{ base: "stretch", md: "flex-end" }} mt={6} mb={4} w="full">
        <Select.Root 
          collection={years} 
          size="sm" 
          width={{ base: "full", md: "150px" }} 
          value={[selectedYear]} 
          onValueChange={(e) => {
            if (e.value[0]) setSelectedYear(e.value[0]);
          }} 
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger borderColor="gray.800" bg="gray.900" color="white">
              <Select.ValueText placeholder="Yıl seç" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content bg="gray.900" color="gray.150" borderColor="gray.800" shadow="xl">
              {years.items.map((year) => (
                <Select.Item item={year} key={year.value} _hover={{ bg: "gray.800", color: "white" }} cursor="pointer">
                  {year.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>

      <Stack direction={{ base: "column", lg: "row" }} gap={6} mt={4} w="full">
        <Box flex="1" bg="gray.900" p={5} borderRadius="lg" border="1px solid" borderColor="gray.800" boxShadow="xl" overflowX="auto">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
        <Box flex="1" bg="gray.900" p={5} borderRadius="lg" border="1px solid" borderColor="gray.800" boxShadow="xl" overflowX="auto">
          <HighchartsReact highcharts={Highcharts} options={pieOptions} />
        </Box>
      </Stack>
    </Box>
  );
}