import mongoose from "mongoose";

const BookingDataSchema=new mongoose.Schema({
     workerEmail:{type:String,required:true},
     customerEmail:{type:String,required:true},
     service:{type:String},
     accept:{type:Boolean,default:null},
     cancel:{type:Boolean,default:null},
     completed:{type:Boolean,default:null},
     time:{type:Date,default:Date.now}
});

const BookingData=mongoose.model("BookingData",BookingDataSchema);
export default BookingData;