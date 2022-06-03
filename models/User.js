import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    imgProfile: {
        type: String,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must have at least 6 characters"],
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    activated: {
        type: Boolean,
        default: false
    },
    online: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        trim: true
    },
    token: {
        type: String,
        trim: true
    },
    tokenType: {
        type: String,
        enum: [
            "none",
            "activateuser",
            "newpassword",
        ]
    }
}, {
    timestamps: true,
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) next() 

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(pass) {
    return await bcrypt.compare(pass, this.password)
}

const User = mongoose.model('User', userSchema)

export default User