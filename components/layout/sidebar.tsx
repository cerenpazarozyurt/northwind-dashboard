"use client";

import { useState, useEffect } from "react";
import { Box, VStack, HStack, Text, Link as ChakraLink, IconButton } from "@chakra-ui/react";
import { Drawer } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Menu, X, Users } from "lucide-react";
import { useColorModeValue } from "@/components/ui/color-mode";

const links = [
  { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/orders",    label: "Siparişler", icon: ShoppingCart },
  { href: "/products",  label: "Ürünler",    icon: Package },
  { href: "/customers", label: "Müşteriler", icon: Users },
];

export function Sidebar() {
  const pathname  = usePathname();
  const [mounted, setMounted]   = useState(false);
  const [isOpen,  setIsOpen]    = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Renk modu değerleri
  const sidebarBg     = useColorModeValue("#F8FAFC",   "#0F172A");
  const sidebarText   = useColorModeValue("gray.900",  "white");
  const sidebarBorder = useColorModeValue("gray.200",  "gray.800");
  const btnBg         = useColorModeValue("white",     "#0F172A");
  const btnBorder     = useColorModeValue("gray.300",  "gray.700");
  const btnColor      = useColorModeValue("gray.700",  "white");

  if (!mounted) return null;

  return (
    <>
      {/* Mobil hamburger butonu */}
      <Box
        display={{ base: "block", md: "none" }}
        position="fixed"
        top="12px"
        left="16px"
        zIndex="overlay"
      >
        <IconButton
          aria-label="Menüyü Aç"
          variant="outline"
          borderColor={btnBorder}
          bg={btnBg}
          color={btnColor}
          size="sm"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
        </IconButton>
      </Box>

      {/* Desktop sidebar */}
      <Box
        as="nav"
        w="240px"
        h="100vh"
        bg={sidebarBg}
        color={sidebarText}
        p={4}
        position="fixed"
        left={0}
        top={0}
        borderRight="1px solid"
        borderColor={sidebarBorder}
        display={{ base: "none", md: "block" }}
        zIndex="banner"
        transition="background-color 0.2s ease, border-color 0.2s ease"
      >
        <SidebarContent pathname={pathname} />
      </Box>

      {/* Mobil drawer */}
      <Drawer.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} placement="start">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            bg={sidebarBg}
            color={sidebarText}
            p={4}
            w="240px"
          >
            <HStack justify="space-between" mb={8} px={2} pt={2}>
              <HStack>
                <Box w="8px" h="8px" borderRadius="full" bg="#3B82F6" />
                <Text fontSize="lg" fontWeight="bold" letterSpacing="tight">
                  Dashboard
                </Text>
              </HStack>
              <Drawer.CloseTrigger asChild>
                <IconButton aria-label="Kapat" variant="ghost" color={sidebarText} size="sm">
                  <X size={18} />
                </IconButton>
              </Drawer.CloseTrigger>
            </HStack>
            <SidebarContent pathname={pathname} />
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  const activeInactiveText = useColorModeValue("gray.500", "gray.400");
  const hoverBg            = useColorModeValue("gray.100", "gray.800");

  return (
    <>
      <HStack mb={8} px={2} pt={2} display={{ base: "none", md: "flex" }}>
        <Box w="8px" h="8px" borderRadius="full" bg="#3B82F6" />
        <Text fontSize="lg" fontWeight="bold" letterSpacing="tight">
          Dashboard
        </Text>
      </HStack>

      <VStack align="stretch" gap={1}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <ChakraLink asChild key={link.href}>
              <NextLink href={link.href}>
                <HStack
                  px={3}
                  py={2.5}
                  borderRadius="md"
                  bg={isActive ? "#3B82F6" : "transparent"}
                  color={isActive ? "white" : activeInactiveText}
                  _hover={{
                    bg: isActive ? "#3B82F6" : hoverBg,
                    color: isActive ? "white" : "inherit",
                  }}
                  transition="all 0.15s"
                  w="full"
                >
                  <Icon size={18} />
                  <Text fontSize="sm" fontWeight={isActive ? "semibold" : "normal"}>
                    {link.label}
                  </Text>
                </HStack>
              </NextLink>
            </ChakraLink>
          );
        })}
      </VStack>
    </>
  );
}