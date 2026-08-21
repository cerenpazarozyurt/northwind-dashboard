import { createClient } from "@supabase/supabase-js";
import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Service role key: RLS'i bypass eder, sadece server-side kullanılır
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return Response.json({ error: "Eksik alanlar var." }, { status: 400 });
    }

    // 1. Auth kullanıcısı oluştur
    const { data: authData, error: signUpError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Supabase'in kendi email onayını devre dışı bırak, bizimkini kullanıyoruz
      });

    if (signUpError || !authData.user) {
      return Response.json(
        { error: signUpError?.message || "Kullanıcı oluşturulamadı." },
        { status: 400 }
      );
    }

    const userId = authData.user.id;
    const verificationToken = crypto.randomUUID();

    // 2. Profil oluştur
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      verification_token: verificationToken,
      is_verified: false,
    });

    if (profileError) {
      // Profil oluşturulamazsa auth user'ı da sil (rollback)
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return Response.json(
        { error: "Profil oluşturulamadı: " + profileError.message },
        { status: 500 }
      );
    }

    // 3. Doğrulama e-postasını gönder
    const htmlContent = EmailTemplate({ firstName, token: verificationToken });

    const { error: emailError } = await resend.emails.send({
      from: "Northwind Traders <onboarding@resend.dev>",
      to: [email],
      subject: "Northwind Hesabınızı Doğrulayın",
      html: htmlContent,
    });

    if (emailError) {
      // Email gönderilemezse hem profil hem auth user'ı sil (tam rollback)
      await supabaseAdmin.from("profiles").delete().eq("id", userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return Response.json(
        {
          error:
            "Doğrulama e-postası gönderilemedi. Lütfen e-posta adresinizi kontrol edin ve tekrar deneyin.",
        },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Register API Hatası:", err);
    return Response.json(
      { error: "Beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
