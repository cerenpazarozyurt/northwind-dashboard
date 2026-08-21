"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, VStack, Text, Flex } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import { toaster } from "@/components/ui/toaster";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            toaster.create({
            title: "Güncelleme Başarısız",
            description: error.message,
            type: "error",
            });
            setIsLoading(false);
            return;
        }

        // Şifre güncellendiği an açılan otomatik oturumu kapatıyoruz ki login sayfasına yönlenebilsin
        await supabase.auth.signOut();

        toaster.create({
            title: "Şifre Güncellendi!",
            description: "Lütfen yeni şifrenizle giriş yapın.",
            type: "success",
        });

        setTimeout(() => {
            router.push("/login");
        }, 1500);
        } catch {
        toaster.create({
            title: "Hata",
            description: "Beklenmeyen bir hata oluştu.",
            type: "error",
        });
        setIsLoading(false);
        }
    };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="#0B1120" p={{ base: 4, md: 8 }}>
      <Box w="full" maxW="420px" bg="white" p={{ base: 6, md: 8 }} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" boxShadow="0 24px 60px rgba(0, 0, 0, 0.35)">
        <Box textAlign="center" mb={8}>
          <Text fontSize="md" fontWeight="bold" color="gray.900">Northwind Traders</Text>
          <Text fontSize="xs" color="gray.500">Yeni Şifre Belirleme</Text>
        </Box>

        <Box mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={1}>Yeni şifre oluştur</Text>
          <Text fontSize="sm" color="gray.500">Lütfen hesabınız için güçlü bir yeni şifre girin.</Text>
        </Box>

        <form onSubmit={handleUpdatePassword}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>Yeni Şifre</Text>
              <Input
                type="password"
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                size="md"
                bg="gray.50"
                borderColor="gray.300"
                borderRadius="lg"
                color="gray.900"
              />
            </Box>

            <Button
              type="submit"
              bg="#3B82F6"
              color="white"
              _hover={{ bg: "#2563EB" }}
              width="full"
              size="md"
              mt={2}
              borderRadius="lg"
              loading={isLoading}
              loadingText="Güncelleniyor..."
            >
              Şifreyi Güncelle
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
}