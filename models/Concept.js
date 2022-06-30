import mongoose from "mongoose";

const conceptSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
})

const Concept = mongoose.model('Concept', conceptSchema)

export default Concept