import mongoose from "mongoose";

const workerDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  adhar: { type: String, required: true },
  pass: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  refreshToken: { type: String }
});


const WorkerData = mongoose.model("workerData", workerDataSchema);
export default WorkerData;
