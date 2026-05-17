import type { Request, Response } from "express";
import { Authservice } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";
import catchAsync from "../../utils/CatchAsync";


const login = catchAsync(async (req: Request, res: Response) => {
    const result = await Authservice.login(req.body)
    ApiResponse.success(res, "Login successful", result)
})

const register = catchAsync(
    async (req: Request, res: Response) => {
    const result = await Authservice.register(req.body)
    ApiResponse.success(res, "Registration successful", result, 201)
}
)

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const result = await Authservice.verifyEmail(req.body)
    ApiResponse.success(res, "Email verified successfully", result)
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const result = await Authservice.changePassword("najmulislam624@gmail.com")
    ApiResponse.success(res, "Password changed successfully", result)
})

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await Authservice.forgotPassword("najmulislam624@gmail.com")
    ApiResponse.success(res, "Password reset link sent successfully", result)
})

const getAllUseres = catchAsync(async (req: Request, res: Response) => {
    const result = await Authservice.getAllUsers();
    ApiResponse.success(res , "user retrieved successfully", result);
})

export const AuthController = {
    login,
    register,
    changePassword,
    forgotPassword,
    getAllUseres,
    verifyEmail
}