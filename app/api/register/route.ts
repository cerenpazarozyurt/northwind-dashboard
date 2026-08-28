import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! //rls'i atlar
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return Response.json({ error: "Eksik alanlar var." }, { status: 400 });
    }

    // 1. Auth kullanıcısı oluşturup id alıyoruz.
    const { data: authData, error: signUpError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Supabase'in kendi email onayını devre dışı bırak
      });

    if (signUpError || !authData.user) {
      return Response.json(
        { error: signUpError?.message || "Kullanıcı oluşturulamadı." },
        { status: 400 }
      );
    }

    const userId = authData.user.id;
    const verificationToken = crypto.randomUUID();

    // 2. id'yi kullanarak profiles tablosuna kaydediyoruz.
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

    // 3. Doğrulama e-postasını göndermek için api/send rotamızı tetikliyoruz
    try {
      const host = request.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";

      const emailRes = await fetch(`${protocol}://${host}/api/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          token: verificationToken,
        }),
      });

      if (!emailRes.ok) {
        throw new Error("Mail servisi hata döndürdü.");
      }
    } catch (emailErr) {
      // Email gönderilemezse veya api/send patlarsa hem profil hem auth user'ı sil
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