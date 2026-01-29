import  { Response,Request, NextFunction } from 'express';
import { prisma } from '../../../lib/prisma';
import { userService } from './user.service';

const getAllUser=async(req:Request,res:Response)=>{
    try {
        const data = await userService.getAllUser()
      
        res.status(200).send({data})
        
    } catch (error) {
        if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "User Get  failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "User Get  failed",
                message: "Unknown error occurred",
            });
        
    }


}
const userActionUpdated=async(req:Request,res:Response)=>{
    
    const {email,status}=req.query as { email: string; status: "ACTIVE" | "BANNED"; };
    
     if (!email || !status) {
    return res.status(400).json({
      error: "User action data missing",
      message: "Both email and status are required",
    });
  }
    try {
        
const result = await userService.userActionUpdated(email,status)

    return res.status(200).json({
      success: true,
      data: result,
    });
         
        
        
    } catch (error) {
          if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "User Action  failed",
                message: error.message,
                });
            }

            return res.status(500).json({
                error: "User Action  failed",
                message: "Unknown error occurred",
            });
    }
    
    
}




export const userController={
    getAllUser,userActionUpdated
}
