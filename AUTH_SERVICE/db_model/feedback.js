import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    comment: {
        type: String
    },
}, { timestamps: true });

const feedBackDataModel = mongoose.model("feedbackData", feedBackSchema);

export { feedBackDataModel };