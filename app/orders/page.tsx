"use client"; 
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";

import { Badge, Table, Box, Flex, Pagination, ButtonGroup, IconButton, Input, InputGroup, Select, createListCollection, Spinner } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

type Order = {
  order_id: number
  customer_id: string
  employee_id: number
  order_date: string
  required_date: string
  shipped_date: string | null
  ship_via: number
  freight: number
  ship_name: string
  ship_address: string
  ship_city: string
  ship_region: string
  ship_postal_code: string
  ship_country: string
}

const columnHelper = createColumnHelper<Order>() //Order tipine özel bir Sütun Oluşturucu

const columns = [
  columnHelper.accessor("order_id", { header: "Sipariş ID", cell: (info) => info.getValue() }),
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
]

const PAGE_SIZE = 10;
const ALL_VALUE = "__all__";

async function fetchOrders(country: string, search: string, page: number) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .range(from, to);

  if (country) {
    query = query.eq("ship_country", country);
  }

  if (search) {
    query = query.ilike("customer_id", `%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return { orders: data as Order[], total: count ?? 0 };
}

async function fetchCountries() {
  const { data, error } = await supabase.from("orders").select("ship_country");
  if (error) throw new Error(error.message);
  const uniqueCountries = [...new Set(data.map((row) => row.ship_country))];
  return uniqueCountries;
}

export default function OrdersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const country = searchParams.get("country") ?? "";
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [searchInput, setSearchInput] = useState(search); //useState olmasaydı eğer inputta her yazdığımız harf sonrası arama yapılırdı. 

  //filtreleme çalışınca url güncelleme
  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== search) {
        updateParams({ search: searchInput, page: "1" });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { data: ordersResult, isLoading } = useQuery({
    queryKey: ["orders", country, search, page], //önceki veriyi cache'den almak için queryKey
    queryFn: () => fetchOrders(country, search, page), //yeni veri çekmek için queryFn
  });

  const { data: countryList } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const countries = createListCollection({
    items: [
      { label: "Tümü", value: ALL_VALUE },
      ...(countryList ?? []).map((c) => ({ label: c, value: c })),
    ],
  });

  const table = useReactTable({
    data: ordersResult?.orders ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box>
      <Flex gap={3} mb={4} justify="flex-end">
        <InputGroup startElement={<LuSearch />} width="240px">
          <Input
            placeholder="Müşteri kodu ara..."
            size="sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </InputGroup>

        <Select.Root
          collection={countries}
          size="sm"
          width="180px"
          value={[country || ALL_VALUE]}
          onValueChange={(details) => {
            const picked = details.value[0];
            updateParams({
              country: picked === ALL_VALUE ? "" : picked,
              page: "1",
            });
          }}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Ülke seç" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Select.Positioner>
            <Select.Content bg="white" color="gray.800">
              {countries.items.map((c) => (
                <Select.Item item={c} key={c.value}>
                  {c.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Select.Root>
      </Flex>
 
      {isLoading ? (
        <Flex justify="center" py={10}>
            <Spinner size="lg" />
        </Flex>
        ) : (
        <>
          <Table.Root size="sm" variant="outline" native>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table.Root>

          <Flex justify="center" mt={6}>
            <Pagination.Root
              count={ordersResult?.total ?? 0}
              pageSize={PAGE_SIZE}
              page={page}
              onPageChange={(details) => updateParams({ page: String(details.page) })}
            >
              <ButtonGroup variant="outline" size="sm">
                <Pagination.PrevTrigger asChild>
                  <IconButton><LuChevronLeft /></IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(item) => (
                    <IconButton variant={{ base: "outline", _selected: "solid" }}>
                      {item.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton><LuChevronRight /></IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        </>
      )}
    </Box>
  );
}