import {createColumnHelper} from "@tanstack/react-table";
import {Customer} from "@/hooks/useCustomersData";
import {Pencil, Trash2} from "lucide-react";
import {Button, HStack } from "@chakra-ui/react";

const columnHelper = createColumnHelper<Customer>();

export function getCustomerColumns(
    onDelete: (customer: Customer) => void,
    onEdit: (customer: Customer) => void 
) {
    return[
        columnHelper.accessor("company_name", {header: "Şirket Adı", cell: (info) => info.getValue()}),

        columnHelper.accessor("contact_name", {header: "İletişim Kişi Adı", cell: (info) => info.getValue()}),

        columnHelper.accessor("contact_title", {header: "Unvan", cell:(info) => info.getValue()}),

        columnHelper.accessor("city", {header: "Şehir", cell:(info) => info.getValue()}),

        columnHelper.accessor("country", {header: "Ülke", cell:(info) => info.getValue()}),

        columnHelper.accessor("phone", {header: "Telefon", cell:(info) => info.getValue()}),

        columnHelper.display({
            id: "actions",
            header: "İşlemler",
            cell: ({row}) => {
                const customer = row.original;
                return (
                    <HStack gap={2}>
                        <Button variant="ghost" size="sm" colorPalette="blue" onClick={() => onEdit(customer)}>
                            <Pencil size={16} />
                        </Button>

                        <Button variant="ghost" size="sm" colorPalette="red" onClick={() => onDelete(customer)}>
                            <Trash2 size={16} />
                        </Button>
                    </HStack>
                );
            },
        }),
    ];
}