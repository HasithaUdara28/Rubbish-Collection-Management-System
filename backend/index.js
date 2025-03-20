import express, { request, response } from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import cors from 'cors';
import driversRouter from './routes/driverRoutes.js'
import userRouter from './routes/userRoutes.js'

const app= express();

app.use(express.json());

app.use(cors());
app.get('/',(request,response)=>{
    console.log(request);
    return response.status(234).send('Welcome to UK')
})

app.use('/drivers',driversRouter);
app.use('/user',userRouter);


mongoose.connect(mongoDBURL)
    .then(()=>{
    console.log('App connected to DB');
    app.listen(PORT,()=>{
    console.log(`App is listening to port: ${PORT}`);
})
}).catch((error)=>{
    console.log(error);
})