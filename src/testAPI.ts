import axios from "axios"
import fs from "fs"
import { processAudioStream } from "./routes/processAudioStream"

async function getReport() {
    const filename = "src/audio_2023-10-05_10-12-23  Rollnumber - 9.ogg"
    console.log(filename)
    const buff = fs.readFileSync(filename)
    // const reference_text = "Our environment is the surrounding where we live in. It is essential to maintain cleanliness by keeping our surroundings clean. There are many ways in which we can ensure that the environment remains clean, like throwing the garbage in the dustbin instead of littering the streets. We should avoid using plastic bags because it pollutes the environment as it cannot be recycled easily. It is also important to maintain personal hygiene by taking a shower every day and washing our hands before every meal. It is our responsibility to ensure cleanliness, because an unclean environment becomes a prominent reason for various diseases like dengue, malaria etc."
    // const edgeAPi = "https://xvivjtnsgdarwhkrkznh.supabase.co/functions/v1/reports/get-report"
    const localApi = "http://localhost:5000/api/get-report"
    const bs64 = buff.toString("base64")
    // const m4atowavbuff = await processAudioStream(bs64)
    console.log("Buffer Converter")
    const k = await axios.post(localApi,{
        "audioBufferBase64":bs64,
        "studentClass":1
    })
    if(k){
        const data = await JSON.stringify(k.data)
        fs.writeFileSync("report.json",data)
        console.log(k.data)
    }
}

getReport()