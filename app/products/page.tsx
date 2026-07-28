"use client";
import { useState } from "react";
import {
  Box, Table, Button, Flex, Text, Input, Field, Dialog, Portal, Select, createListCollection, Spinner,Pagination, IconButton, ButtonGroup,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useProductsData, useAddProduct, PAGE_SIZE } from "../../hooks/useProductsData";
import { productColumns } from "@/helpers/productColumns";
import { productSchema, ProductFormValues } from "@/helpers/productSchema";
import { toaster } from "@/components/ui/toaster";

export default function ProductsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { productsResult, isLoading, categories } = useProductsData(page);
  const addProduct = useAddProduct();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
} = useForm({
    resolver: zodResolver(productSchema),
  });

  const categoryOptions = createListCollection({
    items: (categories ?? []).map((c) => ({
      label: c.category_name,
      value: String(c.category_id),
    })),
  });

  //TanStack Table
  const table = useReactTable({
    data: productsResult?.products ?? [],
    columns: productColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (formData: ProductFormValues) => {
    addProduct.mutate(formData, {
      onSuccess: () => {
        toaster.create({ title: "Ürün Başarıyla Eklendi!", type: "success" });
        setIsOpen(false);
        reset();
      },
      onError: (error) => {
        toaster.create({ title: "Hata", description: error.message, type: "error" });
      },
    });
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={5}>
        <Text fontSize="lg" fontWeight="bold" color="gray.50">
          Ürünler
        </Text>
        <Button bg="#3B82F6" color="white" _hover={{ bg: "#2563EB" }} size="sm" onClick={() => setIsOpen(true)}>
          + Yeni Ürün Ekle
        </Button>
      </Flex>

      {isLoading ? (
        <Flex justify="center" py={20}>
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
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table.Root>

        <Flex justify="center" mt={6}>
          <Pagination.Root
            count={productsResult?.total ?? 0}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={(details) => setPage(details.page)}
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

      <Dialog.Root open={isOpen} onOpenChange={(d) => setIsOpen(d.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Yeni Ürün Ekle</Dialog.Title>
              </Dialog.Header>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Dialog.Body>
                  <Box mb={4}>
                    <Field.Root invalid={!!errors.product_name}>
                      <Field.Label>Ürün Adı</Field.Label>
                      <Input {...register("product_name")} placeholder="Örn: Chai" size="sm" />
                      <Field.ErrorText>{errors.product_name?.message}</Field.ErrorText>
                    </Field.Root>
                  </Box>

                  <Box mb={4}>
                    <Field.Root invalid={!!errors.category_id}>
                      <Field.Label>Kategori</Field.Label>
                      <Controller
                        name="category_id"
                        control={control}
                        render={({ field }) => (
                          <Select.Root
                            collection={categoryOptions}
                            size="sm"
                            value={field.value ? [String(field.value)] : []}
                            onValueChange={(d) => field.onChange(Number(d.value[0]))}
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger>
                                <Select.ValueText placeholder="Kategori seç" />
                              </Select.Trigger>
                              <Select.IndicatorGroup>
                                <Select.Indicator />
                              </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                              <Select.Positioner>
                                <Select.Content bg="white" color="gray.800">
                                  {categoryOptions.items.map((c) => (
                                    <Select.Item item={c} key={c.value}>
                                      {c.label}
                                      <Select.ItemIndicator />
                                    </Select.Item>
                                  ))}
                                </Select.Content>
                              </Select.Positioner>
                            </Portal>
                          </Select.Root>
                        )}
                      />
                      <Field.ErrorText>{errors.category_id?.message}</Field.ErrorText>
                    </Field.Root>
                  </Box>

                  <Box mb={4}>
                    <Field.Root invalid={!!errors.unit_price}>
                      <Field.Label>Birim Fiyatı</Field.Label>
                      <Input {...register("unit_price")} type="number" step="0.01" placeholder="0.00" size="sm" />
                      <Field.ErrorText>{errors.unit_price?.message}</Field.ErrorText>
                    </Field.Root>
                  </Box>

                  <Box mb={2}>
                    <Field.Root invalid={!!errors.units_in_stock}>
                      <Field.Label>Stok Miktarı</Field.Label>
                      <Input {...register("units_in_stock")} type="number" placeholder="0" size="sm" />
                      <Field.ErrorText>{errors.units_in_stock?.message}</Field.ErrorText>
                    </Field.Root>
                  </Box>
                </Dialog.Body>

                <Dialog.Footer>
                  <Button variant="outline" size="sm" mr={3} onClick={() => setIsOpen(false)} type="button">
                    İptal
                  </Button>
                  <Button
                    bg="#3B82F6"
                    color="white"
                    _hover={{ bg: "#2563EB" }}
                    size="sm"
                    type="submit"
                    loading={addProduct.isPending}
                  >
                    Kaydet
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}