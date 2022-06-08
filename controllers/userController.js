import User from "../models/User.js";

import { generateRandomToken, generateToken } from "../helpers/crypt.js";
import { getErrorFields } from "../helpers/validator.js";
import { sendEmailSignUp, sendEmailRequestNewPassword } from "../helpers/email.js";

import { ERROR_TYPE_FIELDS, UNEXPECTED_ERROR, ERROR_MESSAGE } from "../types/index.js";

const singUp = async (req, res) => {
    try {
        const { body : data } = req

        const user = new User(data)

        let validationError = user.validateSync();

        if (validationError) /// VALIDATE
            return res.status(400).json({
                errMsg: "There are some problem with some fields!",
                errType: ERROR_TYPE_FIELDS,
                fields: getErrorFields(validationError)
            })
    
        const usernameIsUsed = await User.exists({username: data.username}) // Si el usuario ya esta usado
        const emailIsUsed = await User.exists({email: data.email}) // Si el email ya esta usuado

        if (usernameIsUsed || emailIsUsed ) { /// CHECK EXISTED USER
            const error = new Error('User already exist')

            const fields = {}

            if (usernameIsUsed) fields["username"] = "Username is used for other user"
            if (emailIsUsed) fields["email"] = "Email is used for other user"

            return res.status(400).json({
                errMsg: error.message,
                errType: ERROR_TYPE_FIELDS,
                fields
            })
        }

        user.token = generateRandomToken() // GENERATE TOKEN
        user.tokenType = "activateuser"

        await user.save()

        sendEmailSignUp(user)

        return res.json({msg: "Your account has been created"})
    } catch (err) {
        console.error('User Controller Error', err)
        const error = new Error('There have been an unexpected error!')
        return res.status(500).json({
            errMsg: error.message,
            errType: UNEXPECTED_ERROR,
        })
    }
}

const confirm = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({token})

        if (!user || user.tokenType !== "activateuser") {
            const err = new Error('The token is not valid')
            return res.status(404).json({
                errMsg: err.message,
                errType: ERROR_MESSAGE,
            })
        }

        user.token = "";
        user.tokenType = "none";
        user.activated = true;
        user.status = true;

        await user.save()

        return res.json({msg: "Your account has been activated"})

    } catch (err) {
        console.error('User Controller Error', err)
        const error = new Error('There have been an unexpected error!')
        return res.status(500).json({
            errMsg: error.message,
            errType: UNEXPECTED_ERROR,
        })
    }
}

const requestNewPassword = async (req, res) => {
    try {
        const { entity } = req.body;

        const user = await User.findOne({
            '$or': [
                {'email': entity},
                {'username': entity},
            ]
        })

        if (!user) {
            const err = new Error('The token is not valid')
            return res.status(404).json({
                errMsg: err.message,
                errType: ERROR_MESSAGE,
            })
        }

        if (!user.activated) {
            const err = new Error('We are sorry but you must verify your account first')
            return res.status(403).json({
                errMsg: err.message,
                errType: ERROR_MESSAGE,
            })
        }

        user.token = generateRandomToken();
        user.tokenType = "newpassword";

        await user.save()

        sendEmailRequestNewPassword(user)

        return res.json({msg: "The link has been sent to your email"})

    } catch (err) {
        console.error('User Controller Error', err)
        const error = new Error('There have been an unexpected error!')
        return res.status(500).json({
            errMsg: error.message,
            errType: UNEXPECTED_ERROR,
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({token})

        if (!user || user.tokenType !== "newpassword") {
            const err = new Error('The token is not valid')
            return res.status(404).json({
                errMsg: err.message,
                errType: ERROR_MESSAGE,
            })
        }

        user.token = "";
        user.tokenType = "none";
        user.password = password;

        await user.save()

        return res.json({msg: "Your password has been updated"})

    } catch (err) {
        console.error('User Controller Error', err)
        const error = new Error('There have been an unexpected error!')
        return res.status(500).json({
            errMsg: error.message,
            errType: UNEXPECTED_ERROR,
        })
    }
}

const login = async (req, res) => {
    try {
        const { entity, password } = req.body

        const user = await User.findOne({
            '$or': [
                {'email': entity},
                {'username': entity},
            ]
        })

        if (!user) 
            return res.status(404).json({
                errMsg: "The user does not exist",
                errType: ERROR_MESSAGE,
            })
        
        if (await user.comparePassword(password)) {
            if (!user.activated) 
                return res.status(400).json({
                    errMsg: "The user is not active",
                    errType: ERROR_MESSAGE,
                })

                const token = generateToken(user._id)

                res.json({
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    username: user.username,
                    token: token
                })

        } else 
            return res.status(404).json({
                errMsg: "Wrong password",
                errType: ERROR_MESSAGE,
            })

    } catch (err) {
        console.error('User Controller Error', err)
        const error = new Error('There have been an unexpected error!')
        return res.status(500).json({
            errMsg: error.message,
            errType: UNEXPECTED_ERROR,
        })
    }
}

const profile = async (req, res) => {
    const { user } = req;

    res.json(user)
}

export {
    singUp,
    confirm,
    requestNewPassword,
    resetPassword,
    login,
    profile
}