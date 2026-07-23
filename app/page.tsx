"use client";

import { useQuery } from "@tanstack/react-query";
import { Box, Heading, Text, Spinner } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";

async function fetchCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .limit(5);

  if (error) throw new Error(error.message);
  return data;
}

export default function Home() {
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  return (
    <Box p={8}>
      <Heading size="xl" mb={4}>
        Northwind Traders - Test
      </Heading>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Text color="red.500">Hata: {error.message}</Text>
      ) : (
        <Box>
          <Text mb={2}>Bulunan müşteri sayısı: {customers?.length}</Text>
          {customers?.map((c) => (
            <Text key={c.customer_id}>{c.company_name}</Text>
          ))}
        </Box>
      )}
    </Box>
  );
}