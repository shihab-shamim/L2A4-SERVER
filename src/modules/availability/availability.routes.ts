import express, { Response, Router,Request, NextFunction } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { prisma } from '../../../lib/prisma';
import { error } from 'node:console';

const router = express.Router();
// auth(UserRole.TUTOR)
router.post("/availability",auth(UserRole.TUTOR),async(req:Request,res:Response)=>{
     if(req.user?.status === "BANNED"){
        return res.status(404).json({
        success: false,
        error:"Tutor profile not Update ! You are Banned",
        data: null,
      });
    }
    
    try {
         const { tutorId, startTime, endTime } = req.body;

        const data=await prisma.availabilitySlot.create({
      data: {
        tutor: {
          connect: { id: tutorId }, 
        },
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
        console.log(data);

        if(data){
            res.status(201).send({data:data,message:"Tutor Profile Create Success"})
         }


        
    }catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "Availability slot create failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Availability slot create failed",
                message: "Unknown error occurred",
            });


            }

})
//  if(req.user?.status === "BANNED"){
//         return res.status(404).json({
//         success: false,
//         error: "Tutor profile not Update ! You are Banned",
//         data: null,
//       });
//     }

router.get("/availability/:id",auth(UserRole.TUTOR),async(req:Request,res:Response)=>{
    const {id}=req.params 
    if(!id){
         res.status(400).send({error:"tutor id undefined for availability slot",message:"Availability slot create failed"})
    }
   
    try {
         

        const data=await prisma.availabilitySlot.findMany({
            where:{
                tutorId:id as string
            }
        })

        if(data){
            res.status(200).send({data:data,message:"Availability slot get Success"})
         }


        
    }catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "Availability slot create failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Availability slot create failed",
                message: "Unknown error occurred",
            });


            }

})

router.delete("/availability/:id",auth(UserRole.TUTOR),async(req:Request,res:Response)=>{
    const id=req.params.id as string;
   
    if(!id){
         res.status(400).send({error:"tutor id undefined for availability slot",message:"Availability slot delete failed"})
    }
   
    try {
         

        const data=await prisma.availabilitySlot.delete({
            where:{
                id 
            }
        })

        if(data){
            res.status(200).send({data:data,message:"Availability slot Delete Success"})
         }


        
    }catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "Availability slot create failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Availability slot create failed",
                message: "Unknown error occurred",
            });


            }

})

router.put(
  "/availability/:id",
  auth(UserRole.TUTOR),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        error: "slot id missing",
        message: "Availability slot update failed",
      });
    }

    try {
      const { startTime, endTime } = req.body as {
        startTime?: string;
        endTime?: string;
      };

      if (!startTime || !endTime) {
        return res.status(400).json({
          error: "startTime/endTime missing",
          message: "Availability slot update failed",
        });
      }

      const data = await prisma.availabilitySlot.update({
        where: { id },
        data: {
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      });

      return res.status(200).json({
        data,
        message: "Availability slot update success",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        return res.status(500).json({
          error: "Availability slot update failed",
          message: error.message,
        });
      }

      console.error(error);
      return res.status(500).json({
        error: "Availability slot update failed",
        message: "Unknown error occurred",
      });
    }
  }
);









export const availability: Router = router;