import { da } from "zod/locales";
import { prisma } from "../../../lib/prisma";
import type { UserLogin, UserRetisger, UserVerifyEmail } from "./auth.validation";
import { get } from "node:http";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../../config/env";
import type { User } from "@prisma/client";
import { sendVerificationEmail } from "../../utils/sendEmail";

const login = async (payload: UserLogin) => {
  const user = await prisma.user.findUnique({
    where: {
        email: payload.email
    }
  })

  if(!user){
    throw new Error("User not found")
  }

  if(!user.isVerified) {
    throw new Error("Email is not verified")
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password)
  if(!isPasswordValid){
    throw new Error("Invalid password")
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
  }

  const accessToken = jwt.sign(
    jwtPayload, 
    env.JWT_ACCESS_SECRET, 
    { expiresIn: "1d" }
  )

 const { password, verificationCode, codeExpiredAt, ...userWithoutSecrets } = user;

 return {
    user: userWithoutSecrets,
    accessToken,
 }
};


const register = async (payload: UserRetisger) => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const codeExpiredAt = new Date(Date.now() + 15 * 60 * 1000);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(
  payload.password,
  saltRounds
);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      age: payload.age,
      verificationCode: verificationCode,
      codeExpiredAt: codeExpiredAt,
    },
  });

  try {
    await sendVerificationEmail(user.email, verificationCode);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }

  const {
    password,
    verificationCode: _,
    codeExpiredAt: __,
    ...userWithoutSecrets
  } = user;

  return userWithoutSecrets;
};

const verifyEmail = async (payload: UserVerifyEmail
) => {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    })

    if(!user) {
        throw new Error("User not found")
    }

    if(user.isVerified){
        throw new Error ("Email is already verified")
    }

    if(!user.verificationCode || user.verificationCode !== payload.code) {
        throw new Error( "Invalid verification code")
    }

    const currentTime = new Date();
    if(user.codeExpiredAt && currentTime > user.codeExpiredAt) {
        throw new Error("verification code has expired")
    }

    const updateduser = await prisma.user.update({
        where: {
            email: payload.email
        },
        data: {
            isVerified: true,
            verificationCode: null,
            codeExpiredAt: null
        }
    })

    return {
        message: "Email verified successfully",
        userId: updateduser.id
    }
}

const changePassword = async (payload: string) => {
  return payload;
};
const forgotPassword = async (payload: string) => {
  return payload;
};

const getAllUsers = async () => {
  const allUsers = await prisma.user.findMany();

  return allUsers;
};

export const Authservice = {
  login,
  register,
  changePassword,
  forgotPassword,
  getAllUsers,
  verifyEmail
};
