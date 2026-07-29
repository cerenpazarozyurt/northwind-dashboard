"use client";

import { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return null;
  }

  return (
    <Flex
      as="header"
      h="60px"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      align="center"
      justify="space-between"
      px={6}
      // Mobilde soldan padding vererek hamburger butonun üstüne binmesini engelliyoruz
      pl={{ base: "60px", md: "6" }} 
      position="fixed"
      top={0}
      // Mobilde tam ekran (left: 0), masada sidebar payı bırakarak (left: 240px) konumlanıyor
      left={{ base: "0", md: "240px" }}
      right={0}
      zIndex={10}
    >
      <Text fontWeight="semibold" color="gray.800" fontSize="sm">
        Northwind Traders
      </Text>

      <Menu.Root positioning={{ placement: "bottom-end" }}>
        <Menu.Trigger asChild>
          <HStack gap={3} cursor="pointer" p={1} _hover={{ opacity: 0.8 }}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {profile?.first_name ? profile.first_name : "Kullanıcı"}
            </Text>
            <Box
              w="32px"
              h="32px"
              borderRadius="full"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="gray.500"
            >
              <User size={18} />
            </Box>
          </HStack>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content bg="white" borderColor="gray.200" minW="160px" borderRadius="md" boxShadow="xl" p={1}>
            <Menu.Item
              value="logout"
              onClick={handleLogout}
              color="red.500"
              cursor="pointer"
              _hover={{ bg: "red.50" }}
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