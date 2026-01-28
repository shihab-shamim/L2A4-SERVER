import express, { Response, Router,Request, NextFunction } from 'express';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();
// auth(UserRole.TUTOR)
router.post("/availability",async(req:Request,res:Response)=>{
    console.log(req.body);

})



export const availability: Router = router;