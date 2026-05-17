import type { NextFunction, Request, Response } from "express"

import env from "../../config/env"
import { ErrorResponse } from "../../types"

export const globalError = (err: any, _req: Request, res: Response, next: NextFunction) => {
     const statusCode = err.statusCode || 500
     const message = err.message || "something went wrong"

     const errResponse: ErrorResponse =  {
          success: false,
          message: message
     }

     if(env.NODE_ENV === "development"){
          errResponse.stack = err.stack
          errResponse.error = err
     }

     res.status(statusCode).json(errResponse)
}

