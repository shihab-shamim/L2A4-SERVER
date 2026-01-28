import { Result } from './../../../generated/prisma/internal/prismaNamespace';

import express, { Response, Router,Request, NextFunction } from 'express';
import { tutorController } from './tutorProfile.controller';
import auth, { UserRole } from '../../middlewares/auth';
import { prisma } from '../../../lib/prisma';

const router = express.Router();
// auth(UserRole.TUTOR)
router.post("/tutors",auth(UserRole.TUTOR),tutorController.createTutorProfile);

router.get("/tutors",auth(UserRole.TUTOR), async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "";
  

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "userId is required",
    });
  }

  try {
    const result = await prisma.tutorProfile.findUnique({
      where: { userId },
      // include: { user: true }, // optional
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        error: "Tutor profile not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        error: "Tutor profile get failed",
        message: error.message,
      });
    }

   
    return res.status(500).json({
      success: false,
      error: "Tutor profile get failed",
      message: "Unknown error occurred",
    });
  }
});
router.put("/tutors",auth(UserRole.TUTOR),async(req: Request, res: Response)=>{

    if(req.user?.status === "BANNED"){
        return res.status(404).json({
        success: false,
        error: "Tutor profile not Update ! You are Banned",
        data: null,
      });
    }
      const {id,userId,headline,about,hourlyRate,currency,subjects,languages}=req.body ;
     
      const result = await prisma.tutorProfile.update({
        where:{id},
        data:{userId,headline,about,hourlyRate,currency,subjects,languages}
      })

       if (!result) {
      return res.status(404).json({
        success: false,
        error: "Tutor profile not Update",
        data: null,
      });
    }
      
      res.status(200).send({data:result})
    
    try {

        
    } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        success: false,
        error: "Tutor profile Updated failed",
        message: error.message,
      });
    }

   
    return res.status(500).json({
      success: false,
      error: "Tutor profile Updated failed",
      message: "Unknown error occurred",
    });
  }
})





export const tutorProfile: Router = router;