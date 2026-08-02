"use client";
import { useState } from "react";
import {
  Table, Box, Flex, Text, Pagination, ButtonGroup, IconButton, Input, InputGroup,
  Select, createListCollection, Spinner, Portal, Dialog, Badge,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useOrdersData, PAGE_SIZE } from "@/hooks/useOrdersData";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import { useOrderDetail } from "@/hooks/useOrderDetail";
import { columns } from "@/helpers/orderColumns";
import {
  calcLineTotal,
  formatDiscount,
  formatMoney,
} from "@/helpers/orderDetailHelpers";

const ALL_VALUE = "__all__";

const thStyle = {
  color: "#F3F4F6",
  borderBottom: "1px solid #1F2937",
  padding: "12px 14px",
  fontWeight: "600",
  textAlign: "left" as const,
};

const tdStyle = {
  color: "#D1D5DB",
  padding: "12px 14px",
};

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { country, search, page, searchInput, setSearchInput, updateParams } = useOrderFilters();
  const { ordersResult, isLoading, countryList } = useOrdersData(country, search, page);
  const {
    data: orderDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useOrderDetail(selectedOrderId);

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

  const itemsTotal =
    orderDetail?.items.reduce(
      (sum, item) =>
        sum + calcLineTotal(item.unit_price, item.quantity, item.discount),
      0
    ) ?? 0;

  return (
    <Box w="full" minW="0">
      <Flex
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        gap={5}
        mb={5}
        direction={{ base: "column", md: "row" }}
      >
        <Box>
          <Text fontSize="xl" fontWeight="semibold" color="white">
            Siparişler
          </Text>
          <Text fontSize="sm" color="gray.400" mt={1}>
            {ordersResult?.total ?? 0} sipariş kaydı
          </Text>
        </Box>

        <Flex gap={3} direction={{ base: "column", sm: "row" }}>
          <InputGroup
            startElement={<LuSearch color="#9ca3af" />}
            width={{ base: "full", sm: "240px" }}
          >
            <Input
              placeholder="Müşteri kodu ara..."
              size="sm"
              bg="gray.900"
              color="white"
              borderColor="gray.800"
              borderRadius="lg"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3b82f6" }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </InputGroup>

          <Select.Root
            collection={countries}
            size="sm"
            width={{ base: "full", sm: "180px" }}
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
              <Select.Trigger bg="gray.900" borderColor="gray.800" color="white" borderRadius="lg">
                <Select.ValueText placeholder="Ülke seç" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content
                  bg="#0f172a"
                  color="gray.150"
                  borderColor="gray.800"
                  shadow="xl"
                  borderRadius="md"
                >
                  {countries.items.map((c) => (
                    <Select.Item item={c} key={c.value} _hover={{ bg: "gray.800", color: "white" }} cursor="pointer">
                      {c.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Flex>
      </Flex>

      {isLoading ? (
        <Flex justify="center" py={20}>
          <Spinner size="lg" />
        </Flex>
      ) : (
        <>
          <Box
            overflowX="auto"
            borderWidth="1px"
            borderTopWidth="3px"
            borderColor="gray.800"
            borderTopColor="blue.400"
            borderRadius="xl"
            bg="gray.900"
            boxShadow="0 10px 28px rgba(0, 0, 0, 0.35)"
          >
            <Table.Root
              size="sm"
              variant="outline"
              native
              css={{
                "& tbody tr": {
                  transition: "background-color 0.15s ease",
                  cursor: "pointer",
                },
                "& tbody tr:hover": {
                  backgroundColor: "#111827",
                },
              }}
            >
              <thead style={{ backgroundColor: "#111827" }}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ color: "#F3F4F6", borderBottom: "1px solid #1F2937", padding: "14px 16px", fontWeight: "600" }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    style={{ borderBottom: "1px solid #1F2937" }}
                    onClick={() => setSelectedOrderId(row.original.order_id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ color: "#D1D5DB", padding: "14px 16px" }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table.Root>
          </Box>

          <Flex justify="center" mt={5}>
            <Pagination.Root
              count={ordersResult?.total ?? 0}
              pageSize={PAGE_SIZE}
              page={page}
              siblingCount={1}
              onPageChange={(details) => updateParams({ page: String(details.page) })}
            >
              <ButtonGroup variant="outline" size="sm" borderColor="gray.700" boxShadow="sm">
                <Pagination.PrevTrigger asChild>
                  <IconButton bg="gray.900" color="white" borderColor="gray.700" _hover={{ bg: "gray.800" }}><LuChevronLeft /></IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  ellipsis={
                    <Box
                      minW="9"
                      h="9"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="gray.900"
                      color="gray.400"
                      borderWidth="1px"
                      borderColor="gray.700"
                      borderRadius="md"
                    >
                      …
                    </Box>
                  }
                  render={(item) => (
                    <IconButton
                      variant={{ base: "outline", _selected: "solid" }}
                      bg={item.value === page ? "blue.600" : "gray.900"}
                      color="white"
                      borderColor="gray.700"
                      _hover={{ bg: item.value === page ? "blue.700" : "gray.800" }}
                    >
                      {item.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton bg="gray.900" color="white" borderColor="gray.700" _hover={{ bg: "gray.800" }}><LuChevronRight /></IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        </>
      )}

      <Dialog.Root
        open={selectedOrderId !== null}
        onOpenChange={(details) => {
          if (!details.open) setSelectedOrderId(null);
        }}
        size="xl"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content
              bg="#0f172a"
              color="gray.100"
              borderColor="gray.800"
              borderWidth="1px"
              shadow="2xl"
              maxW="720px"
              w="full"
              mx={4}
            >
              <Dialog.Header>
                <Dialog.Title color="white">Sipariş Detayı</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                {isDetailLoading ? (
                  <Flex justify="center" py={10}>
                    <Spinner size="lg" />
                  </Flex>
                ) : detailError ? (
                  <Text color="red.400">{detailError.message}</Text>
                ) : orderDetail ? (
                  <Box>
                    <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6}>
                      <Box
                        flex="1"
                        bg="gray.900"
                        borderWidth="1px"
                        borderColor="gray.800"
                        borderRadius="lg"
                        p={4}
                      >
                        <Text fontSize="sm" color="gray.400" mb={2}>
                          Müşteri
                        </Text>
                        <Text fontWeight="semibold" color="white" mb={1}>
                          {orderDetail.customer?.company_name ?? orderDetail.order.customer_id}
                        </Text>
                        <Text fontSize="sm" color="gray.300">
                          {orderDetail.customer?.contact_name ?? "—"}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          {orderDetail.customer?.phone ?? "—"}
                        </Text>
                        <Text fontSize="sm" color="gray.400" mt={2}>
                          {[orderDetail.customer?.city, orderDetail.customer?.country]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </Text>
                      </Box>

                      <Box
                        flex="1"
                        bg="gray.900"
                        borderWidth="1px"
                        borderColor="gray.800"
                        borderRadius="lg"
                        p={4}
                      >
                        <Text fontSize="sm" color="gray.400" mb={2}>
                          Kargo
                        </Text>
                        <Text fontWeight="semibold" color="white" mb={1}>
                          {orderDetail.order.ship_name}
                        </Text>
                        <Text fontSize="sm" color="gray.300">
                          {orderDetail.order.ship_address}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          {[
                            orderDetail.order.ship_city,
                            orderDetail.order.ship_postal_code,
                            orderDetail.order.ship_country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </Text>
                        <Flex align="center" gap={3} mt={3}>
                          <Badge
                            colorPalette={
                              orderDetail.order.shipped_date ? "green" : "yellow"
                            }
                          >
                            {orderDetail.order.shipped_date
                              ? "Kargolandı"
                              : "Beklemede"}
                          </Badge>
                          <Text fontSize="sm" color="gray.400">
                            Kargo: {formatMoney(orderDetail.order.freight)}
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>

                    <Text fontSize="sm" fontWeight="semibold" color="gray.200" mb={3}>
                      Ürün Kalemleri
                    </Text>

                    <Box
                      overflowX="auto"
                      borderWidth="1px"
                      borderColor="gray.800"
                      borderRadius="lg"
                    >
                      <Table.Root size="sm" variant="outline" native>
                        <thead style={{ backgroundColor: "#111827" }}>
                          <tr>
                            <th style={thStyle}>Ürün</th>
                            <th style={thStyle}>Adet</th>
                            <th style={thStyle}>Birim Fiyat</th>
                            <th style={thStyle}>İndirim</th>
                            <th style={thStyle}>Tutar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetail.items.map((item) => (
                            <tr
                              key={`${item.order_id}-${item.product_id}`}
                              style={{ borderBottom: "1px solid #1F2937" }}
                            >
                              <td style={tdStyle}>
                                {item.products?.product_name ?? `Ürün ${item.product_id}`}
                              </td>
                              <td style={tdStyle}>{item.quantity}</td>
                              <td style={tdStyle}>{formatMoney(item.unit_price)}</td>
                              <td style={tdStyle}>{formatDiscount(item.discount)}</td>
                              <td style={tdStyle}>
                                {formatMoney(
                                  calcLineTotal(
                                    item.unit_price,
                                    item.quantity,
                                    item.discount
                                  )
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table.Root>
                    </Box>

                    <Flex justify="flex-end" mt={4} gap={6}>
                      <Text fontSize="sm" color="gray.400">
                        Kalemler: {formatMoney(itemsTotal)}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Kargo: {formatMoney(orderDetail.order.freight)}
                      </Text>
                      <Text fontSize="sm" fontWeight="semibold" color="white">
                        Toplam: {formatMoney(itemsTotal + orderDetail.order.freight)}
                      </Text>
                    </Flex>
                  </Box>
                ) : null}
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}
