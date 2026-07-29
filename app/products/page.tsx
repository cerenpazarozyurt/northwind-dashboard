"use client";
import { useState } from "react";
import {
  Box, Table, Button, Flex, Text, Input, Field, Dialog, Portal, Select, createListCollection, Spinner,Pagination, IconButton, ButtonGroup,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useProductsData, useAddProduct, useDeleteProduct, PAGE_SIZE, Product, useUpdateProduct } from "../../hooks/useProductsData";
import { getProductColumns } from "@/helpers/productColumns";
import { productSchema, ProductFormValues } from "@/helpers/productSchema";
import { toaster } from "@/components/ui/toaster";

export default function ProductsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [categoryId, setCategoryId] = useState<string>("");
  const { productsResult, isLoading, categories } = useProductsData(page, sortOrder, categoryId);  
  const addProduct = useAddProduct();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  function handleDeleteClick(product: Product) {
    setProductToDelete(product);
  }

  async function confirmDelete() {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete.product_id);
      toaster.create({
        title: "Ürün Silindi",
        description: `${productToDelete.product_name} başarıyla silindi.`,
        type: "success",
        closable: true,
      });
      setProductToDelete(null);
    } catch (error) {
      toaster.create({
        title: "Ürün Silinemedi",
        description:
          error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        type: "error",
        closable: true,
      });
    }
  }

  function handleEditClick(product: Product) {
      setProductToEdit(product);
      reset({
        product_name: product.product_name,
        category_id: product.category_id ?? 0,
        unit_price: String(product.unit_price),       
        units_in_stock: String(product.units_in_stock),
      });
      setIsOpen(true);
    }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
} = useForm({
    resolver: zodResolver(productSchema),
  });

  const sortOptions = createListCollection({
    items: [
      { label: "Eskiden Yeniye", value: "asc" },
      { label: "Yeniden Eskiye", value: "desc" },
    ],
  });

  const categoryOptions = createListCollection({
    items: (categories ?? []).map((c) => ({
      label: c.category_name,
      value: String(c.category_id),
    })),
  });

  const ALL_VALUE = "__all__";

  const filterCategoryOptions = createListCollection({
    items: [
      { label: "Tüm Kategoriler", value: ALL_VALUE },
      ...(categories ?? []).map((c) => ({
        label: c.category_name,
        value: String(c.category_id),
      })),
    ],
  });

  //TanStack Table
  const table = useReactTable({
    data: productsResult?.products ?? [],
    columns: getProductColumns(handleDeleteClick, handleEditClick),
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (formData: ProductFormValues) => {
      if (productToEdit) {
        updateProduct.mutate(
          {
            id: productToEdit.product_id,
            updatedData: {
              product_name: formData.product_name,
              category_id: formData.category_id,
              unit_price: Number(formData.unit_price),
              units_in_stock: Number(formData.units_in_stock),
            },
          },
          {
            onSuccess: () => {
              toaster.create({ title: "Ürün Başarıyla Güncellendi!", type: "success" });
              setIsOpen(false);
              setProductToEdit(null);
              reset();
            },
            onError: (error: unknown) => {
              toaster.create({ 
                title: "Hata", 
                description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.", 
                type: "error" 
              });
          },
          }
        );
      } else {
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
      }
    };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={5}>
        <Text fontSize="lg" fontWeight="bold" color="gray.50">
          Ürünler
        </Text>
        <Flex gap={3} align="center">
          <Select.Root
            collection={filterCategoryOptions}
            size="sm"
            width="180px"
            value={[categoryId || ALL_VALUE]}
            onValueChange={(details) => {
              const picked = details.value[0];
              setCategoryId(picked === ALL_VALUE ? "" : picked);
              setPage(1);
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Kategori" />
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
                  {filterCategoryOptions.items.map((c) => (
                    <Select.Item item={c} key={c.value} _hover={{ bg: "gray.800", color: "white" }}>
                      {c.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        <Select.Root
          collection={sortOptions}
          size="sm" width="180px" value={[sortOrder]}
          onValueChange={(details) => setSortOrder(details.value[0] as "asc" | "desc")}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText>Sırala</Select.ValueText>
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
              borderRadius="md">
                {sortOptions.items.map((s) => (
                  <Select.Item item={s} key={s.value} _hover={{ bg: "gray.800", color: "white" }} cursor="pointer">
                    {s.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Button 
          bg="#3B82F6" 
          color="white" 
          _hover={{ bg: "#2563EB" }} 
          size="sm" 
          onClick={() => {
            setProductToEdit(null);
            reset({
              product_name: "",
              category_id: 0,
              unit_price: "",
              units_in_stock: "",
            });
            setIsOpen(true); 
          }}
        >
          + Yeni Ürün Ekle
        </Button>
      </Flex>
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

      <Dialog.Root open={isOpen} onOpenChange={(d) => {
          setIsOpen(d.open);
          if (!d.open) {
            setProductToEdit(null);
            reset();
          }
        }}
      >
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
                                <Select.Content 
                                bg="#0f172a"           
                                color="gray.150"       
                                borderColor="gray.800"  
                                shadow="xl"             
                                borderRadius="md">
                                  {categoryOptions.items.map((c) => (
                                    <Select.Item item={c} key={c.value} _hover={{ bg: "gray.800", color: "white" }} cursor="pointer">
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

      <Dialog.Root
        open={productToDelete !== null}
        onOpenChange={(details) => {
          if (!details.open && !deleteProduct.isPending) {
            setProductToDelete(null);
          }
        }}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Ürünü Sil</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  <strong>{productToDelete?.product_name}</strong> ürününü silmek
                  istediğinize emin misiniz?
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deleteProduct.isPending}
                  onClick={() => setProductToDelete(null)}
                >
                  İptal
                </Button>
                <Button
                  colorPalette="red"
                  size="sm"
                  loading={deleteProduct.isPending}
                  onClick={confirmDelete}
                >
                  Sil
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}