import z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "name should be at least 2 characters long"),
  email: z.email("this field should be a valid email address"),
  password: z.string().min(6, "password should be at least 6 characters long"),
  age: z.number().min(18, "You must be at least 18 years old"),
});

export const ChangePasswordSchema = z.object({
  password: z.string().min(6, "password should be at least 6 characters long"),
  newPassword: z
    .string()
    .min(6, "new password should be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "confirm password should be at least 6 characters long"),
});

export const ForgotPasswordSchema = z.object({
  email: z.email("this field should be a valid email address"),
});

export const userValidationSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long"),

  age: z.number().min(18, "You must be at least 18 years old").optional(),

  role: z.enum(["user", "admin"]).default("user"),
});

export const LoginValidationSchema = z.object({
  email: z.email("this field should be a valid email address"),
  password: z.string().min(6, "password should be at least 6 characters long"),
});

export const verifyEmailSchema = z.object({
  email: z
    .email("Invalid email address"),

  verificationCode: z
    .string()
    .min(6, "Verification code must be 6 characters")
    .max(6, "Verification code must be 6 characters"),
  code: z
    .string()
    .min(6, "Verification code must be 6 characters")
    .max(6, "Verification code must be 6 characters"),
});

export type UserRetisger = z.infer<typeof userValidationSchema>;
export type UserLogin = z.infer<typeof LoginValidationSchema>;
export type UserVerifyEmail = z.infer<typeof verifyEmailSchema>;
