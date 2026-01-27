
import express, { Response, Router,Request, NextFunction } from 'express';
import { tutorController } from './tutorProfile.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();
// auth(UserRole.TUTOR)
router.get("/tutors",tutorController.createTutorProfile)



export const tutorProfile: Router = router;