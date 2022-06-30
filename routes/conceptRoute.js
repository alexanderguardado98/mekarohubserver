import express from "express";

import authMiddleware from "../middleware/authmiddleware.js";
import { newConcept, getConcepts, reorderConcepts } from '../controllers/conceptController.js'

const router = express.Router()

router.post('/', authMiddleware, newConcept)
router.post('/reorder', authMiddleware, reorderConcepts)

router.get('/', authMiddleware, getConcepts)

export default router