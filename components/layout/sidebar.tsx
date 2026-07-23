"use client";

import { useState, useEffect } from "react";
import { Box, VStack, HStack, Text, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Siparişler", icon: ShoppingCart },
  { href: "/products", label: "Ürünler", icon: Package },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Box
      as="nav"
      w="240px"
      h="100vh"
      bg="#0F172A"
      color="white"
      p={4}
      position="fixed"
      left={0}
      top={0}
      borderRight="1px solid"
      borderColor="gray.800"
    >
      <HStack mb={8} px={2} pt={2}>
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
                  color={isActive ? "white" : "gray.400"}
                  _hover={{
                    bg: isActive ? "#3B82F6" : "gray.800",
                    color: "white",
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
    </Box>
  );
}