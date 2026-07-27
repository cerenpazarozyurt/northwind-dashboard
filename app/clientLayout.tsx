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

        <Box flex="1" p="6" ml={{ base: "0", md: "250px" }} overflowX="auto">
          <main>{children}</main>
        </Box>
      </Box>
    </Box>
  );
}