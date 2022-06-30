import mongoose from "mongoose";

const SharedConceptSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    concept: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Concept'
    }, 
    isCreator: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
})

const SharedConcept = mongoose.model('SharedConcept', SharedConceptSchema)

export default SharedConcept;