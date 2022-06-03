import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AUTHENTICATION_ERROR, UNEXPECTED_ERROR } from '../types/index.js'

const authMiddleware = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            let token = req.headers.authorization.split(' ')[1];

            const decode = jwt.verify(token, process.env.JWT_SECRET);

            const { id } = decode;

            const user = await User.findById(id).select("_id username firstName lastName email")

            if (!user) {
                console.error('Auth Middleware Error', err)
                const error = new Error('There have been an unexpected error!')
                return res.status(500).json({
                    errMsg: error.message,
                    errType: UNEXPECTED_ERROR,
                })
            }

            req.user = user;

            return next()
        } catch (err) {
            console.error('Auth Middleware Error', err)
            const error = new Error('There have been an unexpected error!')
            return res.status(500).json({
                errMsg: error.message,
                errType: UNEXPECTED_ERROR,
            })
        }
    } 

    const error = new Error('Authentication Error')
    return res.status(401).json({
        errMsg: error.message,
        errType: AUTHENTICATION_ERROR,
    })
}

export default authMiddleware;