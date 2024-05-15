import express from "express";
import AppRouter from "./routers/index.js";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const app=express();
const PORT=process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/",AppRouter);

app.get("/",(req,res)=>{
    res.send("Welcome to the Server!");
});

mongoose.connect(`${process.env.DB_URL}`)
.then(()=>{app.listen(PORT,()=>{
    console.log('Mongodb is connected')
    console.log(`Server is listening on port ${PORT}`);
})});

