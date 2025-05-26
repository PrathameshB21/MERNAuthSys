import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './Config/dbConnection.js'


import userRoutes from './routes/userRoutes.js'
import UserRouter from './routes/userDetailsRoutes.js'

const app = express();
const allowedOrigin = process.env.origin;
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: function (allowedOrigin, callback) {
        if (!allowedOrigin) {
            callback(new Error('Blocked by CORS'))
        } else {
            callback(null, true)
        }
    },   // ✅ Your frontend URL here
    credentials: true                  // ✅ Allow credentials (cookies, headers)
}));
app.use('/userAuthentication', userRoutes);
app.use('/userDetails', UserRouter);

const port = process.env.Port || 5000;
connectDB()

app.get('/', (req, res) => {
    res.send("Api working")
});

app.listen(port, () => {
    console.log(`--------------🚀 Server running on port ${port}--------------`);

});



