"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Box } from "@chakra-ui/react";

export default function clientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <main>{children}</main>;
  }

return (
    <Box minH="100vh" bg="gray.900" color="white"> 
      <Navbar />

      <Box display="flex" pt="60px">
        <Sidebar />

        <Box 
          flex="1" 
          p={{ base: 4, md: 8 }} 
          ml={{ base: "0", md: "240px" }}
          w={{ base: "full", md: "calc(100% - 240px)" }}
          minW="0"
          overflowX="auto"
        >
          <main>{children}</main>
        </Box>
      </Box>
    </Box>
  );
}