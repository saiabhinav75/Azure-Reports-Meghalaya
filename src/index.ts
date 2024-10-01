import express from "express";
import cors from 'cors';
import ReportRouter from "./routes/index"
import dotenv from 'dotenv';
import ConnectToDB from "./config/db";

import { allowCredentials } from "./config/allowCredentials";

import { corsConfig } from "./config/corsConfig";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: '50mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));


app.use(allowCredentials);
app.use(cors(corsConfig));


app.use(express.json());

app.use('/api',ReportRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})
