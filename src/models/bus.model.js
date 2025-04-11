import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    busNo: {
        type: String,
        required: true,
        unique: true,
    },
    routes: {
        type: Array,
        required: true,
    },
    time: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
},{
    timestamps: true,
});

export const Bus = mongoose.model("Bus", busSchema);
