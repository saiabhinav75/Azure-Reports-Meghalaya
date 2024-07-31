import mongoose from "mongoose";

export default async function ConnectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("Connected to DB");
    } catch (error) {
        console.log("DB Connection Error: ", error);
    }
}
