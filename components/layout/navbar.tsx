"use client";

import { Flex, Text, HStack, Box, Menu } from "@chakra-ui/react";
import { User, LogOut } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data;
};

export function Navbar() {
  const router = useRouter();

  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();

    toaster.create({
      title: "Çıkış yapıldı",
      description: "Giriş sayfasına yönlendiriliyorsunuz.",
      type: "success",
    });

    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  return (
    <Flex
      as="header"
      h="60px"
      bg="gray.800"
      borderBottom="1px solid"
      borderColor="gray.700"
      boxShadow="0 4px 16px rgba(0, 0, 0, 0.16)"
      align="center"
      justify="space-between"
      px={6}
      pl={{ base: "60px", md: "6" }} 
      position="fixed"
      top={0}
      left={{ base: "0", md: "240px" }}
      right={0}
      zIndex={10}
    >
      <Text fontWeight="semibold" color="gray.100" fontSize="sm">
        Northwind Traders
      </Text>

      <Menu.Root positioning={{ placement: "bottom-end" }}>
        <Menu.Trigger asChild>
          <HStack
            gap={3}
            cursor="pointer"
            px={2}
            py={1}
            borderRadius="lg"
            _hover={{ bg: "gray.700" }}
            transition="background-color 0.15s ease"
          >
            <Text fontSize="sm" color="gray.300" fontWeight="medium">
              {profile?.first_name
                ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
                : "Kullanıcı"}
            </Text>
            <Box
              w="32px"
              h="32px"
              borderRadius="full"
              bg="blue.900"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="blue.400"
            >
              <User size={18} />
            </Box>
          </HStack>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content
            bg="gray.800"
            borderColor="gray.600"
            color="gray.100"
            minW="170px"
            borderRadius="lg"
            boxShadow="0 12px 30px rgba(0, 0, 0, 0.4)"
            p={1}
          >
            <Menu.Item
              value="logout"
              onClick={handleLogout}
              color="red.400"
              cursor="pointer"
              _hover={{ bg: "red.900", color: "red.200" }}
              p={2}
              borderRadius="sm"
            >
              <LogOut size={16} />
              <Text fontSize="sm" fontWeight="medium">
                Çıkış Yap
              </Text>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Flex>
  );
}