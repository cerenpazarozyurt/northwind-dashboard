"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Button, Input, VStack, Text, Flex } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import { toaster } from "@/components/ui/toaster";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Supabase'in kendi şifre sıfırlama maili tetikleyicisi
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:3000/update-password`, // Şifreyi güncelleyeceği sayfa
      });

      if (error) {
        toaster.create({
          title: "İşlem Başarısız",
          description: error.message,
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      toaster.create({
        title: "Mail Gönderildi",
        description: "Lütfen şifre sıfırlama bağlantısı için e-postanızı kontrol edin.",
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F5F3FF 100%)" p={{ base: 4, md: 8 }}>
      <Box w="full" maxW="420px" bg="white" p={{ base: 6, md: 8 }} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" boxShadow="0 8px 40px rgba(59, 130, 246, 0.10), 0 2px 8px rgba(0,0,0,0.06)">
        <Box textAlign="center" mb={8}>
          <Text fontSize="md" fontWeight="bold" color="gray.900">Northwind Traders</Text>
          <Text fontSize="xs" color="gray.500">Şifre Yenileme</Text>
        </Box>

        <Box mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={1}>Şifrenizi mi unuttunuz?</Text>
          <Text fontSize="sm" color="gray.500">E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</Text>
        </Box>

        <form onSubmit={handleResetRequest}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>E-posta</Text>
              <Input
                type="email"
                placeholder="ornek@sirket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              loadingText="Gönderiliyor..."
            >
              Sıfırlama Bağlantısı Gönder
            </Button>
          </VStack>
        </form>

        <Text textAlign="center" fontSize="sm" color="gray.500" mt={6}>
          <Link href="/login" style={{ color: "#3B82F6", fontWeight: 500 }}>Giriş sayfasına dön</Link>
        </Text>
      </Box>
    </Flex>
  );
}