import { z } from "zod";

export const patientFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(50, { message: "Username must be at most 50 characters" }),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone),"Invalid phone number"),
});
