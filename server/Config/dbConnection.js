import mongoose from "mongoose";
import 'dotenv/config'
const mongoUrl=process.env.MongoUrl;

const connectDB=async()=>{
    try {
        await mongoose.connect(mongoUrl)

        console.log("--------------✅ MongoDB Connected Successfully--------------");

        mongoose.connection.on('disconnected',()=>{
            console.log("⚠️ MongoDB Connection Lost");
            
        });

        mongoose.connection.on('error',(error)=>{
            console.log(`--------------❌ MongoDB Connection Error:", ${error}--------------`);
            
        })

        
    } catch (error) {
        console.log(`--------------❌Unable establish DbConnection due to error:", ${error}--------------`);
    }
}

process.on("SIGINT",()=>{
    mongoose.connection.close();
    console.log("--------------🔴 MongoDB Disconnected due to application termination--------------");
    process.exit(0);
})

export default connectDB;