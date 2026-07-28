"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Button, Input, VStack, HStack, Text, Flex } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import { toaster } from "@/components/ui/toaster";
import { RegisterSchema, RegisterFormValues } from "@/helpers/authSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inputStyles = {
  size: "md" as const,
  borderColor: "gray.200",
  color: "gray.800",
  _focus: { borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" },
};

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, } = useForm<RegisterFormValues>({ resolver: zodResolver(RegisterSchema) });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toaster.create({
          title: "Kayıt Başarısız",
          description: error.message,
          type: "error",
        });
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
        });

        if (profileError) {
          toaster.create({
            title: "Profil Hatası",
            description: "Kayıt olundu fakat profil oluşturulamadı: " + profileError.message,
            type: "warning",
          });
          return;
        }
      }

      await supabase.auth.signOut();

      toaster.create({
        title: "Kayıt Başarılı!",
        description: "Giriş sayfasına yönlendiriliyorsunuz.",
        type: "success",
      });

      setTimeout(() => {
        window.location.assign("/login");
      }, 800);
    } catch {
      toaster.create({
        title: "Kayıt Başarısız",
        description: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg="#F3F4F6" overflow="hidden">
      <Flex flex="1" align="center" justify="center" bg="white" p={8}>
        <Box w="full" maxW="340px">
          <Box mb={8}>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
              Hesap oluşturun
            </Text>
            <Text fontSize="sm" color="gray.500">
              Başlamak için bilgilerinizi girin.
            </Text>
          </Box>

          <form onSubmit={handleSubmit(handleRegister)}>
            <VStack gap={4} align="stretch">
              <HStack w="full" gap={4}>
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>
                    Ad
                  </Text>
                  <Input
                    placeholder="Örn: Ayşe"
                    {...register("firstName")}
                    {...inputStyles}
                  />
                  {errors.firstName && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.firstName.message}
                    </Text>
                  )}
                </Box>
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>
                    Soyad
                  </Text>
                  <Input
                    placeholder="Örn: Yılmaz"
                    {...register("lastName")}
                    {...inputStyles}
                  />
                  {errors.lastName && (
                    <Text fontSize="xs" color="red.500" mt={1}>
                      {errors.lastName.message}
                    </Text>
                  )}
                </Box>
              </HStack>

              <Box>
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>
                  E-posta
                </Text>
                <Input
                  type="email"
                  placeholder="ornek@sirket.com"
                  {...register("email")}
                  {...inputStyles}
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
                  placeholder="En az 6 karakter"
                  {...register("password")}
                  {...inputStyles}
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
                loadingText="Kaydediliyor..."
              >
                Kayıt Ol
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.500" mt={6}>
            Zaten hesabınız var mı?{" "}
            <Link href="/login" style={{ color: "#3B82F6", fontWeight: 500 }}>
              Giriş yapın
            </Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
