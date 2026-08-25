"use client";

import { useEffect, useRef } from "react"; 
import { Box, Spinner, Flex } from "@chakra-ui/react";
import { useRegionData } from "@/hooks/useRegionData";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function RegionMap() {
  const chartContainerRef = useRef<HTMLDivElement>(null); //useRef: React içinde DOM elemanlarına doğrudan erişmemizi sağlar.
  const { data, isLoading } = useRegionData();

  // Tema renkleri
  const containerBg = useColorModeValue("#f8fafc", "#070d1b");
  const containerBorder = useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.08)");
  
  const mapBg = useColorModeValue("#ffffff", "#0b1120");
  const textColor = useColorModeValue("#1f2937", "#f3f4f6");
  const nullCountryColor = useColorModeValue("#f1f5f9", "#1e293b");
  const borderColor = useColorModeValue("#e2e8f0", "#334155");

  const navBtnFill = useColorModeValue("#ffffff", "#1e293b");
  const navBtnStroke = useColorModeValue("#cbd5e1", "#475569");
  const navBtnColor = useColorModeValue("#1e293b", "#f8fafc");
  const navBtnHoverBg = useColorModeValue("#f1f5f9", "#334155");

  //harita
  useEffect(() => {
    if (!data || !chartContainerRef.current) return;

    let chartInstance: any = null;

    async function drawMap() {
      const Highmaps = (await import("highcharts/highmaps")).default;
      const topology = await fetch(
        "https://code.highcharts.com/mapdata/custom/world.topo.json"
      ).then((res) => res.json());

      chartInstance = Highmaps.mapChart(chartContainerRef.current!, {
        chart: {
          map: topology,
          backgroundColor: mapBg,
        },
        title: {
          text: "Ülkelere Göre Sipariş Dağılımı ve Kargo Süreleri",
          style: { color: textColor, fontWeight: "bold", fontSize: "15px" },
        },
        credits: { enabled: false },

        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: "bottom",
            align: "right",
            theme: {
              fill: navBtnFill,
              stroke: navBtnStroke,
              r: 6,
              style: {
                color: navBtnColor,
                fontWeight: "bold",
              },
              states: {
                hover: {
                  fill: navBtnHoverBg,
                  stroke: navBtnStroke,
                  style: { color: navBtnColor },
                },
                select: {
                  fill: navBtnHoverBg,
                  stroke: navBtnStroke,
                  style: { color: navBtnColor },
                },
              },
            },
          },
        },

        colorAxis: {
          min: 0,
          minColor: "#E0F2FE",
          maxColor: "#3B82F6",
        },
        series: [
          {
            type: "map",
            name: "Sipariş Sayısı",
            data: data,
            joinBy: ["iso-a2", "iso-a2"],
            nullColor: nullCountryColor,
            borderColor: borderColor,
            borderWidth: 0.5,
            tooltip: {
              useHTML: true,
              pointFormatter: function () {
                const point = this as any;
                const deliveryText = point.avgDeliveryDays !== null 
                  ? `<br/>⏱ Ort. Kargo Süresi: <b>${point.avgDeliveryDays} gün</b>`
                  : "";
                
                return `<b>${point.name}</b><br/>📦 Sipariş Sayısı: <b>${point.value}</b>${deliveryText}`;
              },
            },
          } as any,
        ],
      });
    }

    drawMap();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data, mapBg, textColor, nullCountryColor, borderColor, navBtnFill, navBtnStroke, navBtnColor, navBtnHoverBg]);

  if (isLoading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <Box
      bg={containerBg}
      border="1px solid"
      borderColor={containerBorder}
      borderRadius="16px"
      p={4}
      overflow="hidden"
      boxShadow="sm"
    >
      <div ref={chartContainerRef} style={{ width: "100%", height: "450px" }} />
    </Box>
  );
}