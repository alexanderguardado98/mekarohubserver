import Concept from "../models/Concept.js";

import { ERROR_TYPE_FIELDS, UNEXPECTED_ERROR, ERROR_MESSAGE } from "../types/index.js";

const newConcept = async (req, res) => {
    try {
        const { user } = req;
        const { body : data } = req

        const concept = new Concept(data)
        concept.owner = user._id;

        // Validation //////////////////////////////////////////
        let validationError = concept.validateSync();
        if (validationError)
            return res.status(400).json({
                errMsg: "There are some problem with some fields!",
                errType: ERROR_TYPE_FIELDS,
                fields: getErrorFields(validationError)
            })
        // ------------------------------------------
        concept.save();

        res.json({
            msg: "Concept Created!",
            concept: {
                _id: concept._id,
                title: concept.title,
                description: concept.description,
                owner: user,
                createdAt: concept.createdAt
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

const getConcepts = async (req, res) => {
    try {
        const { user } = req;

        const concepts = await Concept.find({ owner: user._id }).select("-__v").populate("owner", "username").sort({ createdAt: -1 });

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
    getConcepts
}