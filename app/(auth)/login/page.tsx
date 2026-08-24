"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Button, Input, VStack, Text, Flex } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import { toaster } from "@/components/ui/toaster";
import { LoginSchema, LoginFormValues } from "@/helpers/authSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, } = useForm<LoginFormValues>({ resolver: zodResolver(LoginSchema) });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      // 1. Supabase ile giriş yapma denemesi
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
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

      // 2. Kullanıcı giriş yaptı ama E-posta Onaylı mı? Kontrol edelim:
      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_verified")
          .eq("id", authData.user.id)
          .single();

        if (profileError || !profile?.is_verified) {
          // Onaylı değilse oturumu hemen kapat ve engelle
          await supabase.auth.signOut();
          toaster.create({
            title: "Hesap Onaylanmadı",
            description: "Lütfen e-postanıza gelen bağlantı ile hesabınızı onaylayın.",
            type: "error",
          });
          setIsLoading(false);
          return;
        }
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
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F5F3FF 100%)"
      p={{ base: 4, md: 8 }}
    >
      <Box
        w="full"
        maxW="420px"
        bg="white"
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 8px 40px rgba(59, 130, 246, 0.10), 0 2px 8px rgba(0,0,0,0.06)"
      >
          <Box textAlign="center" mb={8}>
            <Text fontSize="md" fontWeight="bold" color="gray.900">
              Northwind Traders
            </Text>
            <Text fontSize="xs" color="gray.500">
              Yönetim Paneli
            </Text>
          </Box>

          <Box mb={6}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={1}>
              Giriş yapın
            </Text>
            <Text fontSize="sm" color="gray.500">
              Devam etmek için hesap bilgilerinizi girin.
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack gap={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>
                  E-posta
                </Text>
                <Input
                  type="email"
                  placeholder="ornek@sirket.com"
                  {...register("email")}
                  size="md"
                  bg="gray.50"
                  borderColor="gray.300"
                  borderRadius="lg"
                  color="gray.900"
                  _placeholder={{ color: "gray.400" }}
                  _focus={{ borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" }}
                />
                {errors.email && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.email.message}
                  </Text>
                )}
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>
                  Şifre
                </Text>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  size="md"
                  bg="gray.50"
                  borderColor="gray.300"
                  borderRadius="lg"
                  color="gray.900"
                  _placeholder={{ color: "gray.400" }}
                  _focus={{ borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" }}
                />
                {errors.password && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.password.message}
                  </Text>
                )}
                <Flex justify="flex-end" mt={1}>
                  <Link href="/forgot-password" style={{ fontSize: "12px", color: "#3B82F6", fontWeight: 500 }}>
                    Şifrenizi mi unuttunuz?
                  </Link>
                </Flex>
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
                boxShadow="0 8px 18px rgba(37, 99, 235, 0.25)"
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
  );
}