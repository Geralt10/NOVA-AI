import mongoose from "mongoose";

async function connectDB() {
    try {
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database is connected");
        
    } catch (error) {
        throw new Error("database is not connected")
    }
}

export default connectDB