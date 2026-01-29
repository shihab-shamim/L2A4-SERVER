import express, { Response, Router,Request, NextFunction } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { prisma } from '../../../lib/prisma';


const router = express.Router();

router.post("/category",auth(UserRole.ADMIN),async(req:Request,res:Response)=>{

    const {name,slug,isActive}=req.body
    try {
       const result = await prisma.category.create({
      data: {
       name,slug,isActive
      },
    });

        res.status(201).send({data:result,error:null})
        
    } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "Category create failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Category create failed",
                message: "Unknown error occurred",
            });


            }
})

router.get("/category",auth(UserRole.ADMIN),async(req:Request,res:Response)=>{
    try {
        
       const result = await prisma.category.findMany();

        res.status(200).send({data:result,error:null})
        
    }catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "Category Get failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Category Get failed",
                message: "Unknown error occurred",
            });


            }
})

router.delete("/category",auth(UserRole.ADMIN),async(req:Request,res:Response)=>{
    const id=req.query.id
    // console.log(id);

    try {
        
       const result = await prisma.category.delete({where:{id}});

        res.status(200).send({data:result,error:null})
        
    }catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "Category Delete failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Category Delete failed",
                message: "Unknown error occurred",
            });


            }
})

router.put("/category",auth(UserRole.ADMIN),async(req:Request,res:Response)=>{
    const id=req.query.id as string
    // console.log(id);
    const data=req.body 
    

    try {
        
       const result = await prisma.category.update({where:{id},data});

        res.status(200).send({data:result,error:null})
        
    }catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "Category Delete failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Category Delete failed",
                message: "Unknown error occurred",
            });


            }
})








export const category: Router = router;