import type { Response } from "express";

const success = (
  res: Response,
  message: string,
  data?: any,
  statusCode: number = 200,
) => {
 return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};

export const ApiResponse = {
  success,
};
