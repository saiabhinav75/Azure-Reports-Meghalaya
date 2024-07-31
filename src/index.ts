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
// app.use(cors()); 
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

 
app.use(express.json());
ConnectToDB();

app.use('/api',ReportRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})