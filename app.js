import express from "express";
import dotenv from 'dotenv';
import * as indexRouter from './modules/index.router.js'
import connectDB from "./DB/connectDB.js";
dotenv.config()
const port = process.env.port
const app = express()
const paseURL = process.env.paseURL
app.use(express.json())
app.use(`${paseURL}/auth`,indexRouter.authRouter)
app.use(`${paseURL}/user`,indexRouter.userRouter)
app.use(`${paseURL}/message`,indexRouter.messageRouter)
app.use('*',(req,res)=>{
    res.json({message:"In-valid routing"})
})
connectDB()

app.listen(port,()=>{
    console.log(`Running.................${port}`);
})