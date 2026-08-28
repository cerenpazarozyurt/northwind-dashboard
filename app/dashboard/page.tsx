"use client";

import { Box, Flex, Text, Select, createListCollection, Spinner, SimpleGrid, Stack } from "@chakra-ui/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  calculateTotalRevenue,
  calculateTotalCustomers,
  calculateTotalProducts,
  calculateMonthlyRevenue,
  calculatePieData,
} from "../../helpers/dashboardHelpers";

const years = createListCollection({
  items: [
    { label: "Tümü",  value: "all"  },
    { label: "1996",  value: "1996" },
    { label: "1997",  value: "1997" },
    { label: "1998",  value: "1998" },
  ],
});

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("all");
  const c = useThemeColors();

  const { data: rawData, isLoading, error } = useDashboardData(selectedYear);

  const totalOrders    = rawData?.length || 0;
  const totalRevenue   = calculateTotalRevenue(rawData);
  const totalCustomers = calculateTotalCustomers(rawData);
  const totalProducts  = calculateTotalProducts(rawData);
  const monthlyRevenue = calculateMonthlyRevenue(rawData);
  const pieData        = calculatePieData(rawData);

  const chartOptions = {
    chart: { backgroundColor: "transparent" },
    credits: { enabled: false },
    tooltip: {
      backgroundColor: c.chart.tooltipBg,
      borderColor:     c.chart.tooltipBorder,
      borderRadius: 8,
      shadow: true,
      style: { color: c.chart.tooltipText },
    },
    title: { text: "Aylık Ciro", style: { color: c.chart.titleColor } },
    xAxis: {
      categories: ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
      labels: { style: { color: c.chart.axisLabelColor } },
    },
    yAxis: { title: { text: "" }, labels: { style: { color: c.chart.axisLabelColor } } },
    series: [{ name: "Ciro ($)", data: monthlyRevenue, color: "#3b82f6" }],
  };

  const pieOptions = {
    chart: { type: "pie", backgroundColor: "transparent" },
    credits: { enabled: false },
    tooltip: {
      backgroundColor: c.chart.tooltipBg,
      borderColor:     c.chart.tooltipBorder,
      borderRadius: 8,
      shadow: true,
      style: { color: c.chart.tooltipText },
    },
    title: { text: "En Çok Satış Yapılan Ülkeler", style: { color: c.chart.titleColor } },
    series: [{ name: "Sipariş Sayısı", colorByPoint: true, data: pieData }],
  };

  const statCards = [
    { label: "Toplam Ciro",          value: `$${totalRevenue.toLocaleString("tr-TR", 
      { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, accentColor: "blue.400",   icon: <DollarSign size={20} />, iconColors: c.iconBlue   },
    { label: "Toplam Sipariş Sayısı",value: totalOrders, accentColor: "purple.400", icon: <ShoppingCart size={20} />, iconColors: c.iconPurple },
    { label: "Toplam Müşteri",       value: totalCustomers, accentColor: "green.400",  icon: <Users size={20} />,iconColors: c.iconGreen  },
    { label: "Aktif Ürün Sayısı",    value: totalProducts, accentColor: "orange.400", icon: <Package size={20} />,iconColors: c.iconOrange },
  ];

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
        {statCards.map((card) => (
          <Box
            key={card.label}
            bg={c.cardBg}
            p={5}
            borderRadius="xl"
            boxShadow="0 10px 28px rgba(0, 0, 0, 0.12)"
            border="1px solid"
            borderColor={c.cardBorder}
            borderTop="3px solid"
            borderTopColor={card.accentColor}
            transition="transform 0.2s ease, box-shadow 0.2s ease"
            _hover={{ transform: "translateY(-2px)", boxShadow: "0 14px 34px rgba(0, 0, 0, 0.18)" }}
          >
            <Flex align="center" justify="space-between" gap={4}>
              <Box>
                <Text fontSize="sm" color={c.subTextColor} mb={1}>
                  {card.label}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={c.headingColor}>
                  {card.value}
                </Text>
              </Box>
              <Flex
                w={10} h={10}
                align="center" justify="center"
                borderRadius="lg"
                bg={card.iconColors.bg}
                color={card.iconColors.color}
              >
                {card.icon}
              </Flex>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      <Flex justify={{ base: "stretch", md: "flex-end" }} my={5} w="full">
        <Select.Root
          collection={years}
          size="sm"
          width={{ base: "full", md: "150px" }}
          value={[selectedYear]}
          onValueChange={(e) => { if (e.value[0]) setSelectedYear(e.value[0]); }}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger borderColor={c.inputBorder} bg={c.inputBg} color={c.inputText} borderRadius="lg">
              <Select.ValueText placeholder="Yıl seç" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content bg={c.selectContentBg} color={c.selectContentText} borderColor={c.cardBorder} shadow="xl" borderRadius="md">
              {years.items.map((year) => (
                <Select.Item
                  item={year}
                  key={year.value}
                  _hover={{ bg: c.selectItemHoverBg, color: c.selectItemHoverText }}
                  cursor="pointer"
                >
                  {year.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>

      <Stack direction={{ base: "column", lg: "row" }} gap={5} w="full">
        <Box flex="1" bg={c.cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={c.cardBorder} boxShadow="0 10px 28px rgba(0, 0, 0, 0.12)" overflowX="auto">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>
        <Box flex="1" bg={c.cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={c.cardBorder} boxShadow="0 10px 28px rgba(0, 0, 0, 0.12)" overflowX="auto">
          <HighchartsReact highcharts={Highcharts} options={pieOptions} />
        </Box>
      </Stack>
    </Box>
  );
}