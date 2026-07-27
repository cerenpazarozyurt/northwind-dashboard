"use client"; 
import { Badge, Table, Box, Flex, Pagination, ButtonGroup, IconButton, Input, InputGroup, Select, createListCollection, Spinner } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu"

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { useOrdersData, PAGE_SIZE } from "@/hooks/useOrdersData";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import { columns } from "@/helpers/orderColumns";

const ALL_VALUE = "__all__";

export default function OrdersPage() {
  const { country, search, page, searchInput, setSearchInput, updateParams } = useOrderFilters();
  const { ordersResult, isLoading, countryList } = useOrdersData(country, search, page);

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