"use client";

import RegionMap from "@/components/RegionMap";
import { useColorModeValue } from "@/components/ui/color-mode";

export default function AnalyticsPage() {
  const titleColor    = useColorModeValue("#111827", "#f1f5f9");
  const subtitleColor = useColorModeValue("#6b7280", "#64748b");
  const cardBg        = useColorModeValue("rgba(255,255,255,0.9)", "rgba(15,23,42,0.8)");
  const cardBorder    = useColorModeValue("rgba(0,0,0,0.07)", "rgba(255,255,255,0.06)");
  const cardShadow    = useColorModeValue(
    "0 1px 3px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.06)",
    "0 0 0 1px rgba(59,130,246,0.06), 0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
  );
  const headerColor   = useColorModeValue("#1e293b", "#e2e8f0");

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "8px 0 40px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: "clamp(22px, 3vw, 30px)",
          fontWeight: 800, margin: "0 0 8px",
          letterSpacing: "-0.02em", color: titleColor,
        }}>
          Bölge &amp; Ülke Analizi
        </h1>

        <p style={{ fontSize: 14, color: subtitleColor, margin: 0 }}>
          Sipariş haritası — kargo rotaları, ülke bazlı yoğunluklar ve global dağılım
        </p>
      </div>

      <div style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 20,
        padding: 24,
        backdropFilter: "blur(12px)",
        boxShadow: cardShadow,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#3b82f6", boxShadow: "0 0 8px #3b82f6",
          }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: headerColor, flex: 1 }}>
            Küresel Sipariş Dağılımı
          </span>
        </div>
        <RegionMap />
      </div>

    </div>
  );
}