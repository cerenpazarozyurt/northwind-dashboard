"use client";

import { Flex, Text, HStack, Box, Menu } from "@chakra-ui/react";
import { User, LogOut } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toaster } from "@/components/ui/toaster";
import { useQuery } from "@tanstack/react-query";
import { ColorModeButton, useColorModeValue } from "@/components/ui/color-mode";

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
  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  // ── Dark / Light renk çiftleri ─────────────────────────────────────────
  // Her satır: useColorModeValue("☀️ Light değer", "🌙 Dark değer")
  const navBg          = useColorModeValue("white",     "gray.800");   // navbar arka plan
  const navBorder      = useColorModeValue("gray.200",  "gray.700");   // alt çizgi
  const titleColor     = useColorModeValue("gray.800",  "gray.100");   // "Northwind Traders" yazısı
  const userNameColor  = useColorModeValue("gray.600",  "gray.300");   // kullanıcı adı
  const hoverBg        = useColorModeValue("gray.100",  "gray.700");   // hover efekti
  const avatarBg       = useColorModeValue("blue.100",  "blue.900");   // avatar daire arka planı
  const avatarColor    = useColorModeValue("blue.600",  "blue.400");   // avatar ikon rengi
  const menuBg         = useColorModeValue("white",     "gray.800");   // dropdown menü arka planı
  const menuBorder     = useColorModeValue("gray.200",  "gray.600");   // dropdown kenarlık
  const menuTextColor  = useColorModeValue("gray.800",  "gray.100");   // dropdown metin
  const colorModeBtnColor = useColorModeValue("gray.600", "gray.400"); // 🌙/☀️ toggle ikon rengi

  const handleLogout = async () => {
    await supabase.auth.signOut();

    toaster.create({
      title: "Çıkış yapıldı",
      description: "Giriş sayfasına yönlendiriliyorsunuz.",
      type: "success",
    });

    setTimeout(() => {
      window.location.assign("/login");
    }, 500);
  };

  return (
    <Flex
      as="header"
      h="60px"
      bg={navBg}
      borderBottom="1px solid"
      borderColor={navBorder}
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
      transition="background-color 0.2s ease, border-color 0.2s ease"
    >
      <Text fontWeight="semibold" color={titleColor} fontSize="sm">
        Northwind Traders
      </Text>

      <HStack gap={2}>
        {/* Dark/Light mode toggle */}
        <ColorModeButton
          color={colorModeBtnColor}
          _hover={{ bg: hoverBg }}
          borderRadius="lg"
        />

        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <HStack
              gap={3}
              cursor="pointer"
              px={2}
              py={1}
              borderRadius="lg"
              _hover={{ bg: hoverBg }}
              transition="background-color 0.15s ease"
            >
              <Text fontSize="sm" color={userNameColor} fontWeight="medium">
                {profile?.first_name
                  ? `${profile.first_name} ${profile.last_name ?? ""}`.trim()
                  : "Kullanıcı"}
              </Text>
              <Box
                w="32px"
                h="32px"
                borderRadius="full"
                bg={avatarBg}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={avatarColor}
              >
                <User size={18} />
              </Box>
            </HStack>
          </Menu.Trigger>

          <Menu.Positioner>
            <Menu.Content
              bg={menuBg}
              borderColor={menuBorder}
              color={menuTextColor}
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
      </HStack>
    </Flex>
  );
}