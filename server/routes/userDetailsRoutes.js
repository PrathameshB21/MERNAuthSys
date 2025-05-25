import express from 'express';
import userAuth from '../middelewere/userAuth.js';
import { getUserDetails } from '../controllers/userController.js';

const UserRouter=express.Router();

UserRouter.post('/getUserDetails', userAuth,getUserDetails);

export default UserRouter;