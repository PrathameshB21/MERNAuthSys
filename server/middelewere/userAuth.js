import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;


    if (!token) {
        return res.json({ success: false, message: 'Unauthorized user' })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.jwtSecret)


        if (decodedToken.id) {
            req.body.userId = decodedToken.id;
        } else {
            return res.json({ success: false, message: "Error While verifYing userId" })
        }
      

        next();
    } catch (error) {
        res.json({ success: false, message: "Error While verifYing user" })
    }
}

export default userAuth;