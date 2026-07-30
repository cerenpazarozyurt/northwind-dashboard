import { z } from "zod";

export const customerSchema = z.object({
  company_name: z.string().min(2, "Şirket adı en az 2 karakter olmalı"),
  contact_name: z.string().min(2, "İletişim kişisi adı en az 2 karakter olmalı"),
  contact_title: z.string().min(2, "Unvan en az 2 karakter olmalı"),
  city: z.string().min(2, "Şehir adı en az 2 karakter olmalı"),
  country: z.string().min(2, "Ülke adı en az 2 karakter olmalı"),
  phone: z.string().min(11, "Telefon numarası en az 11 karakter olmalı"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;