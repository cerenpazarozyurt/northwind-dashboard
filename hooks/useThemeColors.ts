/**
 * useThemeColors — tüm sayfalarda kullanılan ortak renk token'ları.
 * Her useColorModeValue çağrısı: (☀️ Light, 🌙 Dark)
 */
"use client";

import { useColorModeValue } from "@/components/ui/color-mode";

export function useThemeColors() {
  return {
    // ── Sayfa & Kart ──────────────────────────────────────────────────────
    // ☀️ Light: beyaz kart / açık sayfa arkaplanı
    // 🌙 Dark : koyu kart (gray.900) / en koyu sayfa (gray.900)
    pageBg:       useColorModeValue("gray.50",   "gray.900"),
    cardBg:       useColorModeValue("white",     "gray.900"),
    cardBorder:   useColorModeValue("gray.200",  "gray.800"),

    // ── Metin ─────────────────────────────────────────────────────────────
    // ☀️ Light: koyu metin okunabilirlik için
    // 🌙 Dark : açık metin koyu arka plan üzerinde
    headingColor: useColorModeValue("gray.900",  "white"),
    subTextColor: useColorModeValue("gray.500",  "gray.400"),
    bodyText:     useColorModeValue("gray.700",  "#D1D5DB"),

    // ── Tablo ─────────────────────────────────────────────────────────────
    // ☀️ Light: açık gri başlık / hafif satır ayrımı
    // 🌙 Dark : koyu başlık / neredeyse siyah satır ayrımı
    tableHeaderText:   useColorModeValue("gray.800",  "#F3F4F6"),
    tableHeaderBorder: useColorModeValue("#E5E7EB",   "#1F2937"),
    tableRowText:      useColorModeValue("gray.700",  "#D1D5DB"),
    tableRowHover:     useColorModeValue("gray.50",   "gray.800"),
    tableRowBorder:    useColorModeValue("gray.100",  "gray.800"),

    // ── Input / Select ────────────────────────────────────────────────────
    // ☀️ Light: beyaz input, açık border
    // 🌙 Dark : koyu input, neredeyse görünmez border
    inputBg:      useColorModeValue("white",     "gray.900"),
    inputBorder:  useColorModeValue("gray.300",  "gray.800"),
    inputText:    useColorModeValue("gray.900",  "white"),
    inputPlaceholder: useColorModeValue("gray.400", "gray.500"),

    // ── Select dropdown içeriği ───────────────────────────────────────────
    // ☀️ Light: beyaz açılır menü
    // 🌙 Dark : çok koyu (#0f172a) açılır menü
    selectContentBg:     useColorModeValue("white",    "#0f172a"),
    selectContentText:   useColorModeValue("gray.800", "gray.200"),
    selectItemHoverBg:   useColorModeValue("gray.100", "gray.800"),
    selectItemHoverText: useColorModeValue("gray.900", "white"),

    // ── Dialog / Modal ────────────────────────────────────────────────────
    // ☀️ Light: beyaz modal
    // 🌙 Dark : en koyu modal (#111827)
    dialogBg:     useColorModeValue("white",     "#111827"),
    dialogBorder: useColorModeValue("gray.200",  "gray.700"),

    // ── İkon kutucukları (renkli aksan) ───────────────────────────────────
    // ☀️ Light: pastel arka plan + orta ton ikon rengi
    // 🌙 Dark : çok koyu arka plan (950) + aynı ikon rengi
    iconBlue:   { bg: useColorModeValue("blue.50",   "blue.950"),   color: "blue.400"   },
    iconPurple: { bg: useColorModeValue("purple.50", "purple.950"), color: "purple.400" },
    iconGreen:  { bg: useColorModeValue("green.50",  "green.950"),  color: "green.400"  },
    iconOrange: { bg: useColorModeValue("orange.50", "orange.950"), color: "orange.400" },

    // ── Highcharts grafik renkleri ────────────────────────────────────────
    // ☀️ Light: açık tooltip, koyu yazı, koyu eksen etiketleri
    // 🌙 Dark : koyu tooltip, açık yazı, gri eksen etiketleri
    chart: {
      tooltipBg:      useColorModeValue("#ffffff", "#111827"),
      tooltipBorder:  useColorModeValue("#e5e7eb", "#374151"),
      tooltipText:    useColorModeValue("#111827", "#f9fafb"),
      titleColor:     useColorModeValue("#111827", "#e5e7eb"),
      axisLabelColor: useColorModeValue("#374151", "#9ca3af"),
    },
  };
}
