"use client";

import { useColorModeValue } from "@/components/ui/color-mode";

export function useThemeColors() {
  return {
    //Sayfa & Kart
    pageBg:       useColorModeValue("gray.50",   "gray.900"),
    cardBg:       useColorModeValue("white",     "gray.900"),
    cardBorder:   useColorModeValue("gray.200",  "gray.800"),

    //Metin 
    headingColor: useColorModeValue("gray.900",  "white"),
    subTextColor: useColorModeValue("gray.500",  "gray.400"),
    bodyText:     useColorModeValue("gray.700",  "#D1D5DB"),

    //Tablo
    tableHeaderText:   useColorModeValue("gray.800",  "#F3F4F6"),
    tableHeaderBorder: useColorModeValue("#E5E7EB",   "#1F2937"),
    tableRowText:      useColorModeValue("gray.700",  "#D1D5DB"),
    tableRowHover:     useColorModeValue("gray.50",   "gray.800"),
    tableRowBorder:    useColorModeValue("gray.100",  "gray.800"),

    //Input / Select 
    inputBg:      useColorModeValue("white",     "gray.900"),
    inputBorder:  useColorModeValue("gray.300",  "gray.800"),
    inputText:    useColorModeValue("gray.900",  "white"),
    inputPlaceholder: useColorModeValue("gray.400", "gray.500"),

    //Select dropdown içeriği 
    selectContentBg:     useColorModeValue("white",    "#0f172a"),
    selectContentText:   useColorModeValue("gray.800", "gray.200"),
    selectItemHoverBg:   useColorModeValue("gray.100", "gray.800"),
    selectItemHoverText: useColorModeValue("gray.900", "white"),

    //Dialog / Modal 
    dialogBg:     useColorModeValue("white",     "#111827"),
    dialogBorder: useColorModeValue("gray.200",  "gray.700"),

    //İkon kutucukları 
    iconBlue:   { bg: useColorModeValue("blue.50",   "blue.950"),   color: "blue.400"   },
    iconPurple: { bg: useColorModeValue("purple.50", "purple.950"), color: "purple.400" },
    iconGreen:  { bg: useColorModeValue("green.50",  "green.950"),  color: "green.400"  },
    iconOrange: { bg: useColorModeValue("orange.50", "orange.950"), color: "orange.400" },

    //Highcharts grafik renkleri
    chart: {
      tooltipBg:      useColorModeValue("#ffffff", "#111827"),
      tooltipBorder:  useColorModeValue("#e5e7eb", "#374151"),
      tooltipText:    useColorModeValue("#111827", "#f9fafb"),
      titleColor:     useColorModeValue("#111827", "#e5e7eb"),
      axisLabelColor: useColorModeValue("#374151", "#9ca3af"),
    },
  };
}
