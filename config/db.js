import mongoose from "mongoose"

const MONGODBURL="mongodb+srv://GowthamAbi:Gowtham2212Abi@jarvis.sqrcl.mongodb.net/?retryWrites=true&w=majority&appName=Jarvis/testing"

const connectDB=async()=>{
    try {
        
        await mongoose.connect(MONGODBURL)

    console.log("db connected")

    } catch (error) {
        console.log("Error to fetch db")
    }
}

export default connectDB