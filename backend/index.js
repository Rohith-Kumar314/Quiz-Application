
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './models/db.js';
import userRouter from './routes/userRoutes.js';
import resultRouter from './routes/resultRoutes.js';
const app = express();
const port = process.env.PORT || 4000;

// MiddleWares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// DB
connectDB();

// ROUTES
// User Routes
app.use("/api/auth",userRouter);

// Result Routes
app.use("/api/results",resultRouter);

app.get("/",(req,res)=>{
    res.send("API Working");

});


app.listen(port,()=>{
    console.log(`Server started `);
});