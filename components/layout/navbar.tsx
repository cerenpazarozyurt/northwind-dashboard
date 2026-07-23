"use client";

import { useState, useEffect } from "react";
import { Flex, Text, HStack, Box } from "@chakra-ui/react";
import { User } from "lucide-react";

export function Navbar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sunucu (SSR) tarafında tarayıcıya inene kadar render etme
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
      position="fixed"
      top={0}
      left="240px"
      right={0}
      zIndex={10}
    >
      <Text fontWeight="semibold" color="gray.800" fontSize="sm">
        Northwind Traders
      </Text>

      <HStack gap={3}>
        <Text fontSize="sm" color="gray.600">
          Ceren
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
          <User size={20} />
        </Box>
      </HStack>
    </Flex>
  );
}