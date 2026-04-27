import mongoose from "mongoose";

const customerDataSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    pass: { type: String },
    phone: { type: Number, required: true },
    refreshToken:{type:String},
    lat: { type: Number },
    lng: { type: Number },
    active: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const CustomerData = mongoose.model("userData", customerDataSchema);
export default CustomerData;
