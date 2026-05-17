export interface successResponse {
    res: Response,
    data?: any,
    message: string,
    statusCode?: number
}

export interface ErrorResponse {
     success: boolean,
     message: string,
     stack?: string,
     error?: string,
}