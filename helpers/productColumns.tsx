import { createColumnHelper } from "@tanstack/react-table";
import { Product } from "../hooks/useProductsData";
import { Pencil, Trash2 } from "lucide-react";
import { Button, HStack, Badge } from "@chakra-ui/react";

const columnHelper = createColumnHelper<Product>();

export function getProductColumns(
  onDelete: (product: Product) => void,
  onEdit: (product: Product) => void
) {
  return [
    columnHelper.accessor("product_id", { header: "#", cell: (info) => info.getValue() }),

    columnHelper.accessor("product_name", { header: "Ürün Adı", cell: (info) => info.getValue() }),

    columnHelper.accessor((row) => row.categories?.category_name, {
      id: "category_name",
      header: "Kategori",
      cell: (info) => info.getValue() || "Kategorisiz",
    }),

    columnHelper.accessor("unit_price", {
      header: "Birim Fiyatı",
      cell: (info) => `$${info.getValue().toFixed(2)}`,
    }),

    columnHelper.accessor("units_in_stock", {
      header: "Stok Adedi",
      cell: (info) => {
        const stock = info.getValue();
        return (
          <Badge colorPalette={stock < 5 ? "red" : "green"}>
            {stock} {stock < 5 && "⚠️"}
          </Badge>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <HStack gap={2}>
            <Button variant="ghost" size="sm" colorPalette="blue" onClick={() => onEdit(product)}>
              <Pencil size={16} />
            </Button>

            <Button variant="ghost" size="sm" colorPalette="red" onClick={() => onDelete(product)}>
              <Trash2 size={16} />
            </Button>
          </HStack>
        );
      },
    }),
  ];
}