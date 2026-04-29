import express from "express";
import BookingData from "../db/booking.js";

const router = express.Router();

router.put("/reject", async (req, res) => {
  try {
    const { email, bookingId } = req.body;
    if (!email) return res.json({ msg: "email not found" });
    console.log(req.body);
    const data = await BookingData.findById(bookingId);
    const custmorEmail = data.customerEmail;
    await fetch('http://localhost:3002/api/socket/bookingRes/booking_reject',{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email:custmorEmail})
    });
    await BookingData.findByIdAndDelete(bookingId);
    return res.json({reject:true})    
  } catch (err) {
    console.log("server error +naveen");
  }
});

router.put("/cancel_customer",async(req,res)=>{
    const {bookingId}=req.body;
    if(!bookingId) return res.json({"cancel":false})
    const data=await BookingData.findById(bookingId);
    const workerEmail=data.workerEmail;
     await fetch('http://localhost:3002/api/socket/bookingRes/cancel_customer',{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({workerEmail})
    });
    await BookingData.findByIdAndDelete(bookingId);
    return res.json({"cancel":true})
})

export default router;
