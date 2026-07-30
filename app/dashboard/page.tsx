"use client";

import { Box, Flex, Text, Select, createListCollection, Spinner, SimpleGrid, Stack } from "@chakra-ui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
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
    credits: { enabled: false },
    tooltip: {
      backgroundColor: "#111827",
      borderColor: "#374151",
      borderRadius: 8,
      shadow: true,
      style: { color: "#f9fafb" },
    },
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
    credits: { enabled: false },
    tooltip: {
      backgroundColor: "#111827",
      borderColor: "#374151",
      borderRadius: 8,
      shadow: true,
      style: { color: "#f9fafb" },
    },
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
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={5} w="full">
        <Box
          bg="gray.900"
          p={5}
          borderRadius="xl"
          boxShadow="0 10px 28px rgba(0, 0, 0, 0.35)"
          border="1px solid"
          borderColor="gray.800"
          borderTop="3px solid"
          borderTopColor="blue.400"
          transition="transform 0.2s ease, box-shadow 0.2s ease"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 14px 34px rgba(0, 0, 0, 0.45)",
          }}
        >
          <Flex align="center" justify="space-between" gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.400" mb={1}>
                Toplam Ciro
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                ${totalRevenue.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </Box>
            <Flex w={10} h={10} align="center" justify="center" borderRadius="lg" bg="blue.950" color="blue.400">
              <DollarSign size={20} />
            </Flex>
          </Flex>
        </Box>

        <Box
          bg="gray.900"
          p={5}
          borderRadius="xl"
          boxShadow="0 10px 28px rgba(0, 0, 0, 0.35)"
          border="1px solid"
          borderColor="gray.800"
          borderTop="3px solid"
          borderTopColor="purple.400"
          transition="transform 0.2s ease, box-shadow 0.2s ease"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 14px 34px rgba(0, 0, 0, 0.45)",
          }}
        >
          <Flex align="center" justify="space-between" gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.400" mb={1}>
                Toplam Sipariş Sayısı
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {totalOrders}
              </Text>
            </Box>
            <Flex w={10} h={10} align="center" justify="center" borderRadius="lg" bg="purple.950" color="purple.400">
              <ShoppingCart size={20} />
            </Flex>
          </Flex>
        </Box>

        <Box
          bg="gray.900"
          p={5}
          borderRadius="xl"
          boxShadow="0 10px 28px rgba(0, 0, 0, 0.35)"
          border="1px solid"
          borderColor="gray.800"
          borderTop="3px solid"
          borderTopColor="green.400"
          transition="transform 0.2s ease, box-shadow 0.2s ease"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 14px 34px rgba(0, 0, 0, 0.45)",
          }}
        >
          <Flex align="center" justify="space-between" gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.400" mb={1}>
                Toplam Müşteri
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {totalCustomers}
              </Text>
            </Box>
            <Flex w={10} h={10} align="center" justify="center" borderRadius="lg" bg="green.950" color="green.400">
              <Users size={20} />
            </Flex>
          </Flex>
        </Box>

        <Box
          bg="gray.900"
          p={5}
          borderRadius="xl"
          boxShadow="0 10px 28px rgba(0, 0, 0, 0.35)"
          border="1px solid"
          borderColor="gray.800"
          borderTop="3px solid"
          borderTopColor="orange.400"
          transition="transform 0.2s ease, box-shadow 0.2s ease"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 14px 34px rgba(0, 0, 0, 0.45)",
          }}
        >
          <Flex align="center" justify="space-between" gap={4}>
            <Box>
              <Text fontSize="sm" color="gray.400" mb={1}>
                Aktif Ürün Sayısı
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="white">
                {totalProducts}
              </Text>
            </Box>
            <Flex w={10} h={10} align="center" justify="center" borderRadius="lg" bg="orange.950" color="orange.400">
              <Package size={20} />
            </Flex>
          </Flex>
        </Box>
      </SimpleGrid>

      <Flex justify={{ base: "stretch", md: "flex-end" }} my={5} w="full">
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

      <Stack direction={{ base: "column", lg: "row" }} gap={5} w="full">
        <Box flex="1" bg="gray.900" p={5} borderRadius="xl" border="1px solid" borderColor="gray.800" boxShadow="0 10px 28px rgba(0, 0, 0, 0.35)" overflowX="auto">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
        <Box flex="1" bg="gray.900" p={5} borderRadius="xl" border="1px solid" borderColor="gray.800" boxShadow="0 10px 28px rgba(0, 0, 0, 0.35)" overflowX="auto">
          <HighchartsReact highcharts={Highcharts} options={pieOptions} />
        </Box>
      </Stack>
    </Box>
  );
}