import mongoose from "mongoose";

const serviceDataSchema =  new mongoose.Schema({
  email: { type: String, required: true },
  name:{type:String},
  service: { type: String, required: true },
  rating: { type: Number, default: 0 },
  avgRating:{type:Number,default:0},
  totalWork: { type: Number, default: 0 },
  money: { type: Number, default: 400 },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  active: { type: Boolean, default: true},
});

const ServiceData = mongoose.model("serviceData", serviceDataSchema);
export default ServiceData;
