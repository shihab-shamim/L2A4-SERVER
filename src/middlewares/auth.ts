import { NextFunction, Request, Response } from "express"
import {auth as betterAuth} from  '../../lib/auth'

declare global {
    namespace Express {
        interface Request {
            user?:{
                id:string,
                email:string,
                name:string,
                role:string,
                emailVerified:boolean,
                status: "ACTIVE" | "BANNED"
            }
        }
    }
}
 export enum UserRole{
    USER='USER',
    ADMIN='ADMIN',
    TUTOR="TUTOR"
 }

  const auth = (...role:UserRole[])=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        // get user session
        
        try {
            const session=await betterAuth.api.getSession({
            headers:req.headers as any
           
        })
        
        //  console.log(session);
       
        if(!session){
            return res.status(401).json({
                message:"you are not authorize",
                success:false
            })
        }
        // if(!session.user.emailVerified){
        //      return res.status(403).json({
        //         message:"Email verification required. please verify your email",
        //         success:false
        //     })


        // }

      
        req.user={
            id:session.user.id,
            email:session.user.email,
            role:session.user.role as string,
            emailVerified:true,
            name:session.user.name,
            status:session.user.status as "ACTIVE" | "BANNED"

        }

        if(role.length && !role.includes(req.user.role as UserRole)){


          return res.status(403).json({
                message:"Forbidden ! you don't permission to access this recorccess",
                success:false
            })
        }
    
       next()
            
        } catch (error) {
            
            console.log(error);
            next(error)
        }

    }
}
export default  auth;