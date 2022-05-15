// build the model
import mongoose from 'mongoose';

const { Schema } = mongoose;
const msgSchema = new Schema({
    msg: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        index: true,
        default: Date()
    },
    tid: { type: String, required: true, default: '0' }
});

export const msgModel = mongoose.model('message', msgSchema);
