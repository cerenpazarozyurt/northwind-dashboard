"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Button, Input, VStack, SimpleGrid, Text, Flex } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { RegisterSchema, RegisterFormValues } from "@/helpers/authSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inputStyles = {
  size: "md" as const,
  bg: "gray.50",
  borderColor: "gray.300",
  borderRadius: "lg",
  color: "gray.900",
  _placeholder: { color: "gray.400" },
  _focus: { borderColor: "#3B82F6", boxShadow: "0 0 0 1px #3B82F6" },
};

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({ resolver: zodResolver(RegisterSchema) });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      const result = await res.json();

      //apiye ulaştı ama api çalışırken sorun oluştu.
      if (!res.ok || result.error) {
        toaster.create({
          title: "Kayıt Başarısız",
          description: result.error || "Bir hata oluştu.",
          type: "error",
        });
        return;
      }

      // Yönlendirme yok — aynı sayfada "e-postanı kontrol et" ekranı göster
      setSentEmail(data.email);
      setEmailSent(true);

    //sunucuya hiç ulaşamadı veya sunucu tamamen çöktü.
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

  // Kayıt başarılı → "E-postanı kontrol et" ekranı (aynı sekme, yönlendirme yok)
  if (emailSent) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F5F3FF 100%)" p={{ base: 4, md: 8 }}>
        <Box
          w="full"
          maxW="420px"
          bg="white"
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="0 8px 40px rgba(59, 130, 246, 0.10), 0 2px 8px rgba(0,0,0,0.06)"
          textAlign="center"
        >
          <VStack gap={5}>
            <Text fontSize="4xl">📧</Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              E-postanızı kontrol edin
            </Text>
            <Text fontSize="sm" color="gray.600" lineHeight="1.7">
              <Box as="span" fontWeight="semibold" color="gray.800">{sentEmail}</Box>{" "}
              adresine bir doğrulama bağlantısı gönderdik.
              Hesabınızı aktive etmek için e-postadaki bağlantıya tıklayın.
            </Text>
            <Box
              px={4}
              py={3}
              bg="blue.50"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="blue.100"
              w="full"
            >
              <Text fontSize="xs" color="blue.700">
                💡 Mail birkaç dakika içinde gelmezse spam klasörünü kontrol edin.
              </Text>
            </Box>
            <Text fontSize="xs" color="gray.400" mt={2}>
              Bağlantıya tıkladıktan sonra bu sekmeyi kapatabilirsiniz.
            </Text>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F5F3FF 100%)" p={{ base: 4, md: 8 }}>
      <Box
        w="full"
        maxW="480px"
        bg="white"
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 8px 40px rgba(59, 130, 246, 0.10), 0 2px 8px rgba(0,0,0,0.06)"
      >
        <Box textAlign="center" mb={8}>
          <Text fontSize="md" fontWeight="bold" color="gray.900">Northwind Traders</Text>
          <Text fontSize="xs" color="gray.500">Yönetim Paneli</Text>
        </Box>
        <Box mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.900" mb={1}>Hesap oluşturun</Text>
          <Text fontSize="sm" color="gray.500">Başlamak için bilgilerinizi girin.</Text>
        </Box>
        <form onSubmit={handleSubmit(handleRegister)}>
          <VStack gap={4} align="stretch">
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>Ad</Text>
                <Input placeholder="Örn: Ayşe" {...register("firstName")} {...inputStyles} />
                {errors.firstName && <Text fontSize="xs" color="red.500" mt={1}>{errors.firstName.message}</Text>}
              </Box>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>Soyad</Text>
                <Input placeholder="Örn: Yılmaz" {...register("lastName")} {...inputStyles} />
                {errors.lastName && <Text fontSize="xs" color="red.500" mt={1}>{errors.lastName.message}</Text>}
              </Box>
            </SimpleGrid>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>E-posta</Text>
              <Input type="email" placeholder="ornek@sirket.com" {...register("email")} {...inputStyles} />
              {errors.email && <Text fontSize="xs" color="red.500" mt={1}>{errors.email.message}</Text>}
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1.5}>Şifre</Text>
              <Input type="password" placeholder="En az 6 karakter" {...register("password")} {...inputStyles} />
              {errors.password && <Text fontSize="xs" color="red.500" mt={1}>{errors.password.message}</Text>}
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
              loadingText="Kaydediliyor..."
            >
              Kayıt Ol
            </Button>
          </VStack>
        </form>
        <Text textAlign="center" fontSize="sm" color="gray.500" mt={6}>
          Zaten hesabınız var mı?{" "}
          <Link href="/login" style={{ color: "#3B82F6", fontWeight: 500 }}>Giriş yapın</Link>
        </Text>
      </Box>
    </Flex>
  );
}