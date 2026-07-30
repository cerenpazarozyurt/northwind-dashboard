import { supabase } from "@/utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Customer = {
  customer_id: string;
  company_name: string;
  contact_name: string;
  contact_title: string;
  city: string;
  country: string;
  phone: string;
};

export const PAGE_SIZE = 10;

function generateCustomerId(companyName: string): string {
  const cleaned = companyName.replace(/[^a-zA-Z]/g, "").toUpperCase();
  const base = cleaned.slice(0, 4).padEnd(4, "X");
  const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return base + randomChar;
}

async function fetchCustomers(page: number, search: string, city: string, country: string) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("customers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("company_name", `%${search}%`);
  }

  if (city) {
    query = query.eq("city", city);
  }

  if (country) {
    query = query.eq("country", country);
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { customers: data as Customer[], total: count ?? 0 };
}

async function fetchCities() {
  const { data, error } = await supabase.from("customers").select("city");
  if (error) throw new Error(error.message);
  return [...new Set(data.map((row) => row.city))];
}

async function fetchCountries() {
  const { data, error } = await supabase.from("customers").select("country");
  if (error) throw new Error(error.message);
  return [...new Set(data.map((row) => row.country))];
}

async function insertCustomer(newCustomer: {
    company_name: string;
    contact_name: string;
    contact_title: string;
    city: string;
    country: string;
    phone: string;
}) {
    let customerId = generateCustomerId(newCustomer.company_name);
    let idExists = true;

    while (idExists) {
        const { data } = await supabase
            .from("customers")
            .select("customer_id")
            .eq("customer_id", customerId)
            .maybeSingle();

        if (data) {
            customerId = generateCustomerId(newCustomer.company_name);
        } else {
            idExists = false;
        }
    }

    const {error} = await supabase.from("customers").insert({
        customer_id: customerId,
        ...newCustomer,
    });

    if (error) throw new Error(error.message);
}

async function deleteCustomer(customerId: string) {
    const {error} = await supabase.from("customers").delete().eq("customer_id", customerId);
    if (error) throw new Error(error.message);
}

async function updateCustomer({
    id,
    updatedData,
}: {
    id: string;
    updatedData: {
        company_name: string;
        contact_name: string;
        contact_title: string;
        city: string;
        country: string;
        phone: string;
    };
}) {
    const {error} = await supabase
    .from("customers")
    .update(updatedData)
    .eq("customer_id", id);

    if(error) throw new Error(error.message);
}

export function useCustomersData(page: number, search: string, city: string, country: string) {
  const customersQuery = useQuery({
    queryKey: ["customers", page, search, city, country],
    queryFn: () => fetchCustomers(page, search, city, country),
  });

  const citiesQuery = useQuery({
    queryKey: ["customerCities"],
    queryFn: fetchCities,
  });

  const countriesQuery = useQuery({
    queryKey: ["customerCountries"],
    queryFn: fetchCountries,
  });

  return {
    customersResult: customersQuery.data,
    isLoading: customersQuery.isLoading,
    cities: citiesQuery.data,
    countries: countriesQuery.data,
  };
}

export function useAddCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: insertCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"]});
        },
    });
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"]});
        },
    });
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCustomer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"]});
        },
    });
}