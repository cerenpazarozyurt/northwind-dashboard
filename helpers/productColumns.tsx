import { createColumnHelper } from "@tanstack/react-table";
import { Product } from "../hooks/useProductsData";

const columnHelper = createColumnHelper<Product>();

export const productColumns = [
  columnHelper.accessor("product_id", { header: "ID", cell: (info) => info.getValue() }),
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
  columnHelper.accessor("units_in_stock", { header: "Stok Adedi", cell: (info) => info.getValue() }),
];