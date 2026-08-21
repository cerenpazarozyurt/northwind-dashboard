"use client";
import { useState } from "react";
import {
  Box, Table, Flex, Button, Text, Input, InputGroup, Field, Dialog, Portal,
  Select, createListCollection, Spinner, Pagination, IconButton, ButtonGroup, Stack,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

import { useCustomersData, useAddCustomer, useDeleteCustomer, useUpdateCustomer, PAGE_SIZE, Customer } from "@/hooks/useCustomersData";
import { getCustomerColumns } from "@/helpers/customerColumns";
import { customerSchema, CustomerFormValues } from "@/helpers/customerSchema";
import { toaster } from "@/components/ui/toaster";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useThemeColors } from "@/hooks/useThemeColors";

const ALL_VALUE = "__all__";

export default function CustomerPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [city, setCity] = useQueryState("city", parseAsString.withDefault(""));
  const [country, setCountry] = useQueryState("country", parseAsString.withDefault(""));

  const [searchInput, setSearchInput] = useState(search);

  const { customersResult, isLoading, cities, countries } = useCustomersData(page, search, city, country);
  const addCustomer = useAddCustomer();
  const deleteCustomer = useDeleteCustomer();
  const updateCustomer = useUpdateCustomer();

  const c = useThemeColors();
  const theadBg   = useColorModeValue("#F9FAFB", "#111827");
  const thColor   = useColorModeValue("#1F2937", "#F3F4F6");
  const thBorder  = useColorModeValue("#E5E7EB", "#1F2937");
  const tdColor   = useColorModeValue("#374151", "#D1D5DB");
  const trBorder  = useColorModeValue("#E5E7EB", "#1F2937");
  const trHoverBg = useColorModeValue("#F9FAFB", "#111827");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  const cityOptions = createListCollection({
    items: [
      { label: "Tüm Şehirler", value: ALL_VALUE },
      ...(cities ?? []).map((c) => ({ label: c, value: c })),
    ],
  });

  const countryOptions = createListCollection({
    items: [
      { label: "Tüm Ülkeler", value: ALL_VALUE },
      ...(countries ?? []).map((c) => ({ label: c, value: c })),
    ],
  });

  function handleDeleteClick(customer: Customer) {
    setCustomerToDelete(customer);
  }

  function handleEditClick(customer: Customer) {
    setEditingCustomer(customer);
    reset({
      company_name: customer.company_name,
      contact_name: customer.contact_name,
      contact_title: customer.contact_title,
      city: customer.city,
      country: customer.country,
      phone: customer.phone,
    });
    setIsOpen(true);
  }

  async function confirmDelete() {
    if (!customerToDelete) return;

    try {
      await deleteCustomer.mutateAsync(customerToDelete.customer_id);
      toaster.create({
        title: "Müşteri Silindi",
        description: `${customerToDelete.company_name}`,
        type: "success",
        closable: true,
      });
      setCustomerToDelete(null);
    } catch (error) {
      toaster.create({
        title: "Müşteri Silinemedi",
        description: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        type: "error",
        closable: true,
      });
    }
  }

  const table = useReactTable({
    data: customersResult?.customers ?? [],
    columns: getCustomerColumns(handleDeleteClick, handleEditClick),
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (formData: CustomerFormValues) => {
    if (editingCustomer) {
      updateCustomer.mutate(
        { id: editingCustomer.customer_id, updatedData: formData },
        {
          onSuccess: () => {
            toaster.create({ title: "Müşteri Güncellendi", type: "success" });
            setIsOpen(false);
            reset();
          },
          onError: (error) => {
            toaster.create({ title: "Hata", description: error.message, type: "error" });
          },
        }
      );
    } else {
      addCustomer.mutate(formData, {
        onSuccess: () => {
          toaster.create({ title: "Müşteri Başarıyla Eklendi!", type: "success" });
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
    <Box w="full" minW="0">
      {/* Başlık + Yeni Müşteri butonu */}
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={5}
        mb={5}
        w="full"
      >
        <Box>
          <Text fontSize="xl" fontWeight="semibold" color={c.headingColor}>
            Müşteriler
          </Text>
          <Text fontSize="sm" color={c.subTextColor} mt={1}>
            {customersResult?.total ?? 0} müşteri kaydı
          </Text>
        </Box>

        <Button
          bg="#3B82F6"
          color="white"
          _hover={{ bg: "#2563EB" }}
          size="sm"
          borderRadius="lg"
          w={{ base: "full", sm: "auto" }}
          onClick={() => {
            setEditingCustomer(null);
            reset({ company_name: "", contact_name: "", contact_title: "", city: "", country: "", phone: "" });
            setIsOpen(true);
          }}
        >
          + Yeni Müşteri Ekle
        </Button>
      </Stack>

      {/* Filtreler */}
      <Stack
        direction={{ base: "column", sm: "row" }}
        gap={3}
        mb={5}
        w="full"
        justify={{ base: "flex-start", sm: "flex-end" }}
      >
        <InputGroup
          startElement={<LuSearch color="#9ca3af" />}
          width={{ base: "full", sm: "240px" }}
        >
          <Input
            placeholder="Şirket adı ara..."
            size="sm"
            bg={c.inputBg}
            color={c.inputText}
            borderColor={c.inputBorder}
            borderRadius="lg"
            _placeholder={{ color: c.inputPlaceholder }}
            _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3b82f6" }}
            value={searchInput}
            onChange={(e) => {
              const val = e.target.value;
              setSearchInput(val);
              setSearch(val ? val : null);
              setPage(1);
            }}
          />
        </InputGroup>

        <Select.Root
          collection={cityOptions}
          size="sm"
          width={{ base: "full", sm: "210px" }}
          value={[city || ALL_VALUE]}
          onValueChange={(details) => {
            const picked = details.value[0];
            setCity(picked === ALL_VALUE ? null : picked);
            setPage(1);
          }}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg={c.inputBg} borderColor={c.inputBorder} color={c.inputText} borderRadius="lg">
              <Select.ValueText placeholder="Şehir" />
            </Select.Trigger>
            <Select.IndicatorGroup><Select.Indicator /></Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content bg={c.selectContentBg} color={c.selectContentText} borderColor={c.cardBorder} shadow="xl" borderRadius="md">
                {cityOptions.items.map((item) => (
                  <Select.Item item={item} key={item.value} _hover={{ bg: c.selectItemHoverBg, color: c.selectItemHoverText }} cursor="pointer">
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Select.Root
          collection={countryOptions}
          size="sm"
          width={{ base: "full", sm: "180px" }}
          value={[country || ALL_VALUE]}
          onValueChange={(details) => {
            const picked = details.value[0];
            setCountry(picked === ALL_VALUE ? null : picked);
            setPage(1);
          }}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg={c.inputBg} borderColor={c.inputBorder} color={c.inputText} borderRadius="lg">
              <Select.ValueText placeholder="Ülke" />
            </Select.Trigger>
            <Select.IndicatorGroup><Select.Indicator /></Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content bg={c.selectContentBg} color={c.selectContentText} borderColor={c.cardBorder} shadow="xl" borderRadius="md">
                {countryOptions.items.map((item) => (
                  <Select.Item item={item} key={item.value} _hover={{ bg: c.selectItemHoverBg, color: c.selectItemHoverText }} cursor="pointer">
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Stack>

      {/* Tablo */}
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
            borderColor={c.cardBorder}
            borderTopColor="green.400"
            borderRadius="xl"
            bg={c.cardBg}
            boxShadow="0 10px 28px rgba(0, 0, 0, 0.12)"
          >
            <Table.Root
              size="sm"
              variant="outline"
              native
              css={{
                "& tbody tr": { transition: "background-color 0.15s ease" },
                "& tbody tr:hover": { backgroundColor: trHoverBg },
              }}
            >
              <thead style={{ backgroundColor: theadBg }}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ color: thColor, borderBottom: `1px solid ${thBorder}`, padding: "14px 16px", fontWeight: "600" }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${trBorder}` }}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ color: tdColor, padding: "14px 16px" }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table.Root>
          </Box>

          {/* Pagination */}
          <Flex justify="center" mt={5}>
            <Pagination.Root
              count={customersResult?.total ?? 0}
              pageSize={PAGE_SIZE}
              page={page}
              siblingCount={1}
              onPageChange={(details) => setPage(details.page)}
            >
              <ButtonGroup variant="outline" size="sm" borderColor={c.cardBorder} boxShadow="sm">
                <Pagination.PrevTrigger asChild>
                  <IconButton bg={c.cardBg} color={c.headingColor} borderColor={c.cardBorder} _hover={{ bg: c.tableRowHover }}>
                    <LuChevronLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  ellipsis={
                    <Box
                      minW="9" h="9"
                      display="flex" alignItems="center" justifyContent="center"
                      bg={c.cardBg}
                      color={c.subTextColor}
                      borderWidth="1px"
                      borderColor={c.cardBorder}
                      borderRadius="md"
                    >
                      …
                    </Box>
                  }
                  render={(item) => (
                    <IconButton
                      variant={{ base: "outline", _selected: "solid" }}
                      bg={item.value === page ? "blue.600" : c.cardBg}
                      color={item.value === page ? "white" : c.headingColor}
                      borderColor={c.cardBorder}
                      _hover={{ bg: item.value === page ? "blue.700" : c.tableRowHover }}
                    >
                      {item.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton bg={c.cardBg} color={c.headingColor} borderColor={c.cardBorder} _hover={{ bg: c.tableRowHover }}>
                    <LuChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        </>
      )}

      {/* Ekle / Düzenle Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={(d) => setIsOpen(d.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg={c.dialogBg} color={c.headingColor} borderColor={c.dialogBorder} borderWidth="1px" shadow="2xl">
              <Dialog.Header>
                <Dialog.Title color={c.headingColor}>
                  {editingCustomer ? "Müşteriyi Düzenle" : "Yeni Müşteri Ekle"}
                </Dialog.Title>
              </Dialog.Header>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Dialog.Body>
                  {[
                    { field: "company_name" as const,  label: "Şirket Adı",       placeholder: "Örn: Acme Corp",       error: errors.company_name  },
                    { field: "contact_name" as const,  label: "İletişim Kişisi",  placeholder: "Örn: Ayşe Yılmaz",    error: errors.contact_name  },
                    { field: "contact_title" as const, label: "Unvan",            placeholder: "Örn: Satış Müdürü",   error: errors.contact_title },
                    { field: "city" as const,          label: "Şehir",            placeholder: "Örn: İstanbul",        error: errors.city          },
                    { field: "country" as const,       label: "Ülke",             placeholder: "Örn: Türkiye",         error: errors.country       },
                    { field: "phone" as const,         label: "Telefon",          placeholder: "Örn: 05551234567",     error: errors.phone         },
                  ].map(({ field, label, placeholder, error }, i, arr) => (
                    <Box key={field} mb={i < arr.length - 1 ? 4 : 2}>
                      <Field.Root invalid={!!error}>
                        <Field.Label color={c.bodyText}>{label}</Field.Label>
                        <Input
                          {...register(field)}
                          placeholder={placeholder}
                          size="sm"
                          bg={c.inputBg}
                          borderColor={c.inputBorder}
                          color={c.inputText}
                          _placeholder={{ color: c.inputPlaceholder }}
                        />
                        <Field.ErrorText color="red.400">{error?.message}</Field.ErrorText>
                      </Field.Root>
                    </Box>
                  ))}
                </Dialog.Body>

                <Dialog.Footer>
                  <Button
                    variant="outline"
                    size="sm"
                    mr={3}
                    onClick={() => setIsOpen(false)}
                    type="button"
                    borderColor={c.cardBorder}
                    color={c.bodyText}
                    _hover={{ bg: c.tableRowHover }}
                  >
                    İptal
                  </Button>
                  <Button
                    bg="#3B82F6"
                    color="white"
                    _hover={{ bg: "#2563EB" }}
                    size="sm"
                    type="submit"
                    loading={editingCustomer ? updateCustomer.isPending : addCustomer.isPending}
                  >
                    Kaydet
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Silme Onay Dialog */}
      <Dialog.Root
        open={customerToDelete !== null}
        onOpenChange={(details) => {
          if (!details.open && !deleteCustomer.isPending) {
            setCustomerToDelete(null);
          }
        }}
        role="alertdialog"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg={c.dialogBg} color={c.headingColor} borderColor={c.dialogBorder} borderWidth="1px" shadow="2xl">
              <Dialog.Header>
                <Dialog.Title color={c.headingColor}>Müşteriyi Sil</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color={c.bodyText}>
                  <strong style={{ color: c.headingColor }}>{customerToDelete?.company_name}</strong>{" "}
                  müşterisini silmek istediğinize emin misiniz?
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  size="sm"
                  borderColor={c.cardBorder}
                  color={c.bodyText}
                  _hover={{ bg: c.tableRowHover }}
                  disabled={deleteCustomer.isPending}
                  onClick={() => setCustomerToDelete(null)}
                >
                  İptal
                </Button>
                <Button
                  colorPalette="red"
                  size="sm"
                  loading={deleteCustomer.isPending}
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