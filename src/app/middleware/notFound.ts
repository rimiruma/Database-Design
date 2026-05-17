import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { error } from "node:console";
import path from "node:path";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(status.NOT_FOUND).json({
        success: false,
        message: "api not found",
        error: {
            path: req.originalUrl,
            message: "The requested API endpoint does not exist",
        }
    });
}

export default notFound;