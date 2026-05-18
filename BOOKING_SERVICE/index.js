import express from "express";
import bookingReq from "./Booking_Jobs/bookingReq.js";
import bookingRes from "./Booking_Jobs/bookingRes.js";
import bookingData from "./Booking_Jobs/bookingUserData.js";
import bookingCancel from "./Booking_Jobs/bookingCancel.js";
import userData from "./Booking_Jobs/bookingUserData.js";
import bookingComp from "./Booking_Jobs/bookingComp.js";
import bookingRej from "./Booking_Jobs/bookingRej.js"
import cors from "cors";
import mongoose from "mongoose";

const ip="54.89.167.115";


await mongoose.connect("mongodb+srv://yashi:naveen%402003@cluster0.vrbuumh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("DB is connected successfully")
}).catch((err)=>{
   console.log(err);
})
const app=express();
app.use(express.json());
app.use(cors({
    origin: `http://${ip}:5173`,
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
}));



app.use("/api/booking/bookingReq",bookingReq);
app.use("/api/booking/bookingRes",bookingRes);
app.use("/api/booking/bookingData",bookingData);
app.use("/api/booking/bokingCancelUser",bookingCancel);
app.use("/api/booking/userData",userData);
app.use("/api/booking/Booking",bookingComp);
app.use("/api/booking/bookingrej",bookingRej);



app.listen(3001,()=>{
    console.log("booling service is started at port 3001");
})