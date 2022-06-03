import jwt from 'jsonwebtoken'

export const generateRandomToken = () => {
    const randomNumber = Math.random().toString(32).substring(2);
    const date = Date.now().toString(32);

    return randomNumber + date;
}

export const generateToken = (id) => {
    const JWT_SECRET = process.env.JWT_SECRET

    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d'
    })
}