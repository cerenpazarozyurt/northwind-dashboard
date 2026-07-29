import { Badge } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Order } from "@/hooks/useOrdersData";

const columnHelper = createColumnHelper<Order>();

export const columns = [
  columnHelper.accessor("customer_id", { header: "Müşteri", cell: (info) => info.getValue() }),
  columnHelper.accessor("order_date", { header: "Tarih", cell: (info) => info.getValue() }),
  columnHelper.accessor("ship_country", { header: "Ülke", cell: (info) => info.getValue() }),
  columnHelper.accessor("freight", { header: "Kargo Ücreti", cell: (info) => `$${info.getValue().toFixed(2)}` }),
  columnHelper.accessor("shipped_date", {
    header: "Sipariş Durumu",
    cell: (info) => {
      const shippedDate = info.getValue();
      return (
        <Badge colorPalette={shippedDate ? "green" : "yellow"}>
          {shippedDate ? "Kargolandı" : "Beklemede"}
        </Badge>
      );
    },
  }),
];