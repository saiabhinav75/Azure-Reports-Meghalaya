import { NextFunction, Request, Response } from "express";


let ORIGINS = 'http://localhost:8081,http://localhost:3000,https://staging.d2zqkvxnnybywm.amplifyapp.com'

export const allowCredentials = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const origin = req.headers.origin;
    const origins = ORIGINS?.split(',')!;
    if (origin && origins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin,X-Request-With,Content-Type,Accept",
        );
    }
    next();
};