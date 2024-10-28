import { z } from "zod";

const emailSchema = z.string().email().min(1).max(100).trim();
const passwordSchema = z
  .string()
  .min(6)
  .max(100)
  .regex(/[@$!%*?&]/) //Password must contain at least one special character
  .regex(/\d/); // Password must contain at least one number

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

//extending the loginschem and passing it to registerschema
export const registerSchema = loginSchema
  .extend({
    fullname: z.string().min(1).max(50).trim(),
    phone: z
      .string()
      .min(2)
      .max(20)
      .regex(/^\+?\d+$/), //Phone number can start with a + and must contain only numbers
    confirmPassword: z.string().min(6).max(100),
    role: z.enum(["admin", "nurse", "client"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


export const verificationCodeSchema = z.string().min(1).max(24).trim();
