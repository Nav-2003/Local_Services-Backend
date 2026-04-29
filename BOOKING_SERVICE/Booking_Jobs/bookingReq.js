import express, { json } from "express";
import BookingData from "../db/booking.js";
const router=express.Router();

const getDistance=async(custmorEmail,workerEmail)=>{
    const customerEmail=custmorEmail;
    const result=await fetch("http://localhost:3000/api/auth/serviceDist/getDistance",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({customerEmail,workerEmail})
    })
    const data=await result.json();
    console.log(data);
    return {
      distance:data.distance,
      name:data.name
    }
}

router.put('/bookingReq',async(req,res)=>{
 const {custmorEmail,workerEmail,service}=req.body;
  if(!custmorEmail||!workerEmail) return res.json({assign:false});
  const {distance,name}=await getDistance(custmorEmail,workerEmail);
  console.log(distance,name);
    const booking=await BookingData.create({
      customerEmail:custmorEmail,
      workerEmail:workerEmail,
      service:service
  });

const result=await fetch("http://localhost:3002/api/socket/bookingReq/request_to_worker",{
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({ name,
    dist: distance,
    bookingId:booking._id,
    workerEmail})
})
const data=await result.json();
console.log(data);
   return res.json({assign:true,bookingId:booking._id});
});


export default router;
