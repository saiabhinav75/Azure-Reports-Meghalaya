import express from "express";
import cors from 'cors';
import ReportRouter from "./routes/index"
import dotenv from 'dotenv';
import ConnectToDB from "./config/db";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: '50mb' }));
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));
app.use(cors());

app.use(express.json());
ConnectToDB();

app.use('/api',ReportRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})
