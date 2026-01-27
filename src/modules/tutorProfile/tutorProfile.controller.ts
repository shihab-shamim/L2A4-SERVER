import  { Response,Request, NextFunction } from 'express';
import { tutorProfileService } from './tutorProfile.service';

const createTutorProfile=async(req:Request,res:Response)=>{
 
    // const userId="dljflkdjfd"
    // if(userId){
    //     return
    // }
   
    try {
        const data = await tutorProfileService.createTutorProfile(req.body )
         if(data){
            res.status(201).send({data:data,message:"Tutor Profile Create Success"})
         }
        
    }catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "Tutor profile create failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Tutor profile create failed",
                message: "Unknown error occurred",
            });


            }



}



export const tutorController={
    createTutorProfile
}
