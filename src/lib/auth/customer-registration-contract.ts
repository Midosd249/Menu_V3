import { z } from "zod";

export const customerRegistrationSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    brandName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(8).max(30),
    email: z.string().trim().email().max(320),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const GENERIC_REGISTRATION_ERROR = {
  ar: "تعذر إنشاء الحساب. راجع البيانات وحاول مرة أخرى.",
  en: "We couldn't create the account. Check your details and try again.",
} as const;
