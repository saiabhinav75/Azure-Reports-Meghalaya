// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
// import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express, { Request, Response, Express } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

import { Buffer } from "node:buffer";
import { main } from "./azureSpeech";
import { convertBase64WebMToWAV } from "./webmtowav";
import { UpdateRCASLJ } from "./updateSLJ";
import { processAudioStream } from "./processAudioStream";
import fs from 'fs'

// const port = 3000;
const ReportRouter: Express = express();
const supabaseUrl = process.env.supabaseUrl!;
const supabaseKey = process.env.supabaseKey!;
// const supabaseClient = createClient(supabaseUrl, supabaseKey);
const subscriptionKey = "c07451709ffe4fe3862595c6703763dd";
const serviceRegion = "eastus";
export let supabaseClient: SupabaseClient<any, "public", any>;

ReportRouter.use(express.json({ limit: "50mb" }));
ReportRouter.use(
  express.raw({ type: "application/octet-stream", limit: "50mb" })
);

interface Report {
  feedback:ScoreBucket,
  accuracy: ScoreBucket;
  fluency: ScoreBucket;
  comp: ScoreBucket;
  prosody: ScoreBucket;
  partA_score: PartAScore;
  words: Word[];
}

interface ScoreBucket {
  score: number;
  bucket: string;
}

interface PartAScore {
  score: number;
}

interface Word {
  word: string;
  accuracy_score?: number;
  error_type: "Mispronunciation" | "None" | "Omission" | "Insertion";
}

ReportRouter.post(
  "/get-report",
  (req, res, next) => {
    // const authHeader = req.headers["authorization"];
    // const studentClass = req.body.studentClass;
    // const authHeader = req.headers['authorization']
    // console.log(authHeader);
    // console.log("auth wala");
    // if (!authHeader) {
    //   return res.status(403).json({ message: "Forbidden" });
    // }
    // supabaseClient = createClient(supabaseUrl, supabaseKey, {
    //   global: { headers: { Authorization: authHeader } },
    // });
    next();
  },
  async (req: Request, res: Response) => {
    console.log("Requested to Route /get-report")
    let base64Audio: string = req.body.audioBufferBase64 as string;
    const platform: string = req.body.platform as string;

    base64Audio = await processAudioStream(base64Audio) as string
    // base64Audio = res

    const buffer = Buffer.from(base64Audio, "base64");
    // const reference_text = req.body.reference_text;
    const student_id = req.body.student_id;
    const assessment_id = req.body.assessment_id;
    const studentClass = req.body.studentClass;
    const assessmentType = req.body.assessmentType;
    // const token = authHeader && authHeader.split(' ')[1]
    const reference_text = fs.readFileSync(`SEKHAR/${studentClass}.txt`,'utf-8')
    console.log(reference_text)
    if (!base64Audio) {
      res.status(400).json("Invalid Input");
    }
    try {
      const report = (await main(
        buffer,
        subscriptionKey,
        serviceRegion,
        reference_text,
        studentClass
      )) as Report;
      if (report) {
        // const { data: mera_data, error: tera_error } = await supabaseClient
        //   .from("RCA_Results")
        //   .select("id,partB_score")
        //   .eq("student_id", student_id)
        //   .eq("assessment_id", assessment_id);
        // if (tera_error) {
        //   console.log(tera_error);
        //   return res.status(500).json({ message: "Unable to Get Report" });
        // }
        // if (mera_data && mera_data.length > 0) {
        //   // console.log(mera_data);
        //   const partB_ka_score = mera_data[0].partB_score;
        //   const total_again = (partB_ka_score + report.partA_score.score) / 2;
        //   let final_bucket = "Emergent";

          // if (total_again >= 0 && total_again <=50) {
          //   final_bucket = "Emergent";
          // } else if (total_again > 50 && total_again <80) {
          //   final_bucket = "Transitional";
          // } else {
          //   final_bucket = "Proficient";
          // }

          // const { data, error } = await supabaseClient
          //   .from("RCA_Results")
          //   .update([
          //     {
          //       partA_report: report,
          //       partA_score: report.partA_score.score,
          //       total:
          //         (report.partA_score.score + mera_data[0].partB_score) / 2,
          //       grade: final_bucket,
          //       feedback:report.feedback
          //     },
          //   ])
          //   .eq("id", mera_data[0].id);
          // if (error) {
          //   console.log("MOYE MOYE");
          //   console.log(error);
          // } else {
          //   console.log("MAZE HI MAZE");
            // console.log(data);
            // await UpdateRCASLJ(assessmentType,student_id,final_bucket,studentClass)
          // }
          //## partA_Score = report.partA_score.score
        //   const { data, error } = await supabaseClient
        //     .from("RCA_Results")
        //     .insert([
        //       {
        //         partA_report: report,
        //         partA_score: report.partA_score.score,
        //         assessment_id,
        //         student_id,
        //         feedback:report.feedback
        //       },
        //     ]);
        //   if (error) {
        //     console.log("MOYE MOYE");
        //     console.log(error);
        //   } else {
        //     console.log("MAZE HI MAZE");
        //     // console.log(data);
        //   }
        // }

        res.status(200).json(report);
      }
    } catch {
      console.log("Error Getting Report");
      res.status(500).json({ message: "Unable to Get Report" });
    }
  }
);

export default ReportRouter;

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
