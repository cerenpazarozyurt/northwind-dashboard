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
      const { error } = await supabase.auth.signInWithPassword({
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
                  borderColor="gray.200"
                  color="gray.800"
                  _focus={{ borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" }}
                />
                {errors.email && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.email.message}
                  </Text>
                )}
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
                  {...register("password")}
                  size="md"
                  borderColor="gray.200"
                  color="gray.800"
                  _focus={{ borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" }}
                />
                {errors.password && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {errors.password.message}
                  </Text>
                )}
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