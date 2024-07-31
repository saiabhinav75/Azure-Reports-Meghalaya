import { CorsOptions } from "cors";


let ORIGINS = 'http://localhost:8081,http://localhost:3000,https://staging.d2zqkvxnnybywm.amplifyapp.com'

export const corsConfig: CorsOptions = {
    
    origin: (origin, callback) => {
        const origins =ORIGINS?.split(',')!;
        if (!origin || (origin && origins.indexOf(origin) !== -1)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};