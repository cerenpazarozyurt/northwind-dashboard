interface EmailTemplateProps {
  firstName: string;
  token: string;
}

export function EmailTemplate({ firstName, token }: EmailTemplateProps) {
  const verifyUrl = `http://localhost:3000/verify?token=${token}`;

  // Doğrudan saf HTML string döndürüyoruz (React component karmaşası yok)
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2>Hoş Geldin, ${firstName}!</h2>
      <p>Northwind Traders yönetim paneline kayıt olduğun için teşekkür ederiz.</p>
      <p>Hesabını doğrulamak ve aktive etmek için lütfen aşağıdaki butona tıkla:</p>
      
      <a 
        href="${verifyUrl}"
        style="
          display: inline-block;
          background-color: #3B82F6;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          borderRadius: 8px;
          font-weight: bold;
          margin-top: 16px;
        "
      >
        E-postamı Doğrula
      </a>
      
      <p style="margin-top: 24px; font-size: 12px; color: #666;">
        Eğer bu isteği sen yapmadıysan, bu e-postayı görmezden gelebilirsin.
      </p>
    </div>
  `;
}