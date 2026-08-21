import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, token } = body;

    // Fonksiyondan doğrudan HTML string'ini alıyoruz
    const htmlContent = EmailTemplate({ firstName, token });

    const { data, error } = await resend.emails.send({
      from: 'Northwind Traders <onboarding@resend.dev>',
      to: [email],
      subject: 'Northwind Hesabınızı Doğrulayın',
      html: htmlContent, // Resend'e html parametresiyle veriyoruz
    });

    if (error) {
      console.error("Resend Mail Hatası:", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("API Catch Hatası:", error);
    return Response.json({ error }, { status: 500 });
  }
}