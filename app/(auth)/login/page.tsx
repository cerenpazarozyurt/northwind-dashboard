"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Button, Input, VStack, Text, Flex } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import { toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanEmail = email.trim();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        toaster.create({
          title: "Giriş Başarısız",
          description: error.message || "E-posta veya şifre hatalı!",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      toaster.create({
        title: "Giriş Başarılı!",
        description: "Yönlendiriliyorsunuz...",
        type: "success",
      });

      setTimeout(() => {
        window.location.assign("/dashboard");
      }, 800);
    } catch {
      toaster.create({
        title: "Giriş Başarısız",
        description: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg="#F3F4F6" overflow="hidden">
      <Flex flex="1" align="center" justify="center" bg="white" p={8}>
        <Box w="full" maxW="340px">
          <Box mb={8}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
              Giriş yapın
            </Text>
            <Text fontSize="sm" color="gray.500">
              Devam etmek için hesap bilgilerinizi girin.
            </Text>
          </Box>

          <form onSubmit={handleLogin}>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>
                  E-posta
                </Text>
                <Input
                  type="email"
                  placeholder="ornek@sirket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="md"
                  borderColor="gray.200"
                  color="gray.800"
                  _focus={{ borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" }}
                />
              </Box>

              <Box>
                <Flex justify="space-between" mb={1.5}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Şifre
                  </Text>
                  <Text fontSize="xs" color="#3B82F6" cursor="pointer">
                    Şifremi unuttum
                  </Text>
                </Flex>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="md"
                  borderColor="gray.200"
                  color="gray.800"
                  _focus={{ borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" }}
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
                loading={isLoading}
                loadingText="Doğrulanıyor..."
              >
                Giriş Yap
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.500" mt={6}>
            Hesabınız yok mu?{" "}
            <Link href="/register" style={{ color: "#3B82F6", fontWeight: 500 }}>
              Kayıt olun
            </Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}