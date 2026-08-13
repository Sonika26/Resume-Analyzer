import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(error);

  if (error instanceof Error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong.",
  });
};