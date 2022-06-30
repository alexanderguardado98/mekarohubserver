import Concept from "../models/Concept.js";
import SharedConcept from "../models/SharedConcept.js";

import { ERROR_TYPE_FIELDS, UNEXPECTED_ERROR, ERROR_MESSAGE } from "../types/index.js";

const newConcept = async (req, res) => {
    try {
        const { user } = req;
        const { body : data } = req

        const concept = new Concept(data)
        concept.owner = user._id

        // Validation //////////////////////////////////////////
        let validationError = concept.validateSync();
        if (validationError)
            return res.status(400).json({
                errMsg: "There are some problem with some fields!",
                errType: ERROR_TYPE_FIELDS,
                fields: getErrorFields(validationError)
            })
        // ------------------------------------------
        await concept.save();

        const _maxConcept = await SharedConcept.find({user: user._id}).sort({"order": -1}).limit(1)
        const currentMaxConcept = (_maxConcept.length > 0)? _maxConcept[0].order + 1: 1;

        const sharedConcept = new SharedConcept({ 
            user: user._id,
            concept: concept._id,
            order: currentMaxConcept,
            isCreator: true,
        })

        await sharedConcept.save();

        res.json({
            msg: "Concept Created!",
            concept: {
                _id: concept._id,
                title: concept.title,
                description: concept.description,
                createdAt: concept.createdAt,
                owner: user.username,
                isCreator: true,
                order: currentMaxConcept,
            },
        })
    } catch (err) {
        console.error('Concept Controller Error', err)
        const error = new Error('There have been an unexpected error!')
        return res.status(500).json({
            errMsg: error.message,
            errType: UNEXPECTED_ERROR,
        })
    }
}

const reorderConcepts = async (req, res) => {
    try {
        const { user } = req;
        const { body : {concepts} } = req

        console.log(concepts)

        

        const prevSharedConcept = await SharedConcept.findOne({ user: user._id, concept: prev });
        const currentSharedConcept = await SharedConcept.findOne({ user: user._id, concept: current });

        if (prevSharedConcept && currentSharedConcept) {
            const prevOrder = prevSharedConcept.order;
            currentSharedConcept.order = prevOrder;


            const currentOrder = currentSharedConcept.order;

            prevSharedConcept.order = currentOrder;

            await prevSharedConcept.save()
            await currentSharedConcept.save()

            return res.json({msg: "Concepts' Order updated!", data: { prev, current }});
        }

        return res.status(400).json({
            errMsg: "We couldn't update the order",
            errType: ERROR_MESSAGE,
        })
        
    } catch (err) {
        console.error('Concept Controller Error', err)
        const error = new Error('There have been an unexpected error!')
        return res.status(500).json({
            errMsg: error.message,
            errType: UNEXPECTED_ERROR,
        })
    }
}

const getConcepts = async (req, res) => {
    try {
        const { user } = req;

        const sharedConcepts = await SharedConcept.find({ user: user._id }).select("-__v").populate({ path: 'concept', populate: { path: 'owner', select: "username" } }).sort({ order: 1 });

        const concepts = sharedConcepts.map(shared => {
            const {concept, isCreator, order} = shared;

            return {
                _id: concept._id,
                title: concept.title,
                description: concept.description,
                createdAt: concept.createdAt,
                owner: concept.owner.username,
                isCreator,
                order
            }
        })

        res.json(concepts);
    } catch (err) {
        console.error('Concept Controller Error', err)
        const error = new Error('There have been an unexpected error!')
        return res.status(500).json({
            errMsg: error.message,
            errType: UNEXPECTED_ERROR,
        })
    }
}

export {
    newConcept,
    getConcepts,
    reorderConcepts
}