"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Text, Flex, VStack, Spinner } from "@chakra-ui/react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setErrorMessage("Geçersiz veya eksik doğrulama token'ı.");
        return;
      }

      try {
        const { data: profile, error: fetchError } = await supabase
          .from("profiles")
          .select("id, is_verified")
          .eq("verification_token", token)
          .single();

        if (fetchError || !profile) {
          setStatus("error");
          setErrorMessage("Geçersiz ya da süresi dolmuş doğrulama bağlantısı.");
          return;
        }

        if (!profile.is_verified) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              is_verified: true,
              verification_token: null,
            })
            .eq("id", profile.id);

          if (updateError) {
            setStatus("error");
            setErrorMessage("Hesap onaylanırken bir veritabanı hatası oluştu.");
            return;
          }
        }

        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMessage("Beklenmeyen bir hata oluştu.");
      }
    }

    verifyEmail();
  }, [token]);

  // Başarı durumunda 3 saniye geri sayım sonrası login'e yönlendir
  useEffect(() => {
    if (status !== "success") return;

    // Redirect: 3 saniye sonra login'e git (setCountdown dışında)
    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    // Countdown: her saniye 1 azalt (sadece görsel)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [status, router]);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="#0B1120" p={4}>
      <Box
        w="full"
        maxW="420px"
        bg="white"
        p={8}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="0 24px 60px rgba(0, 0, 0, 0.35)"
        textAlign="center"
      >
        {status === "loading" && (
          <VStack gap={5}>
            <Spinner size="lg" color="#3B82F6" borderWidth="3px" />
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              Hesabınız doğrulanıyor...
            </Text>
            <Text fontSize="sm" color="gray.500">
              Lütfen birkaç saniye bekleyin.
            </Text>
          </VStack>
        )}

        {status === "success" && (
          <VStack gap={4}>
            <Text fontSize="4xl">✅</Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              Hesabınız onaylandı!
            </Text>
            <Text fontSize="sm" color="gray.600">
              E-posta adresiniz başarıyla doğrulandı.
              Artık hesabınıza giriş yapabilirsiniz.
            </Text>
            <Box
              mt={2}
              px={4}
              py={3}
              bg="blue.50"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="blue.100"
              w="full"
            >
              <Text fontSize="sm" color="blue.700" fontWeight="medium">
                {countdown} saniye içinde giriş sayfasına yönlendiriliyorsunuz...
              </Text>
            </Box>
          </VStack>
        )}

        {status === "error" && (
          <VStack gap={4}>
            <Text fontSize="4xl">❌</Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.900">
              Doğrulama Başarısız
            </Text>
            <Text fontSize="sm" color="gray.600">
              {errorMessage}
            </Text>
            <Link
              href="/register"
              style={{
                display: "block",
                width: "100%",
                marginTop: "8px",
                padding: "12px 16px",
                backgroundColor: "#1a202c",
                color: "white",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "14px",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Kayıt Sayfasına Dön
            </Link>
          </VStack>
        )}
      </Box>
    </Flex>
  );
}