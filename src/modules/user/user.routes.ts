
import express, { Response, Router,Request, NextFunction } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { userController } from './user.controller';

const router = express.Router();
// auth(UserRole.TUTOR)
router.get("/users",auth(UserRole.ADMIN),userController.getAllUser)
router.put("/users",auth(UserRole.ADMIN),userController.userActionUpdated)

export const users: Router = router;


export const tutorProfile: Router = router;