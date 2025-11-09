import express from 'express'
import router from './routes/authRoutes.js'
import connectDB from './config/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fabric from './routes/Fabric/fabricRouter.js'
const app=express()
connectDB()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
     credentials: true
}))
app.use('/',router)
app.use('/inventory',fabric)
app.listen(3000,()=>{
    console.log("Server is on 3000")
})