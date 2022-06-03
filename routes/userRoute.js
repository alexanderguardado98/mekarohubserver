import express from "express";

import authMiddleware from "../middleware/authmiddleware.js";
import { singUp, confirm, requestNewPassword, resetPassword, login, profile } from "../controllers/userController.js";

const router = express.Router()

router.post('/signup', singUp)
router.get('/confirm/:token', confirm)
router.post('/forgot-password', requestNewPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/login', login)

router.get('/profile', authMiddleware, profile)

export default router