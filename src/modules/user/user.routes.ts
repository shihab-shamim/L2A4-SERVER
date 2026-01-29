
import express, { Response, Router,Request, NextFunction } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { userController } from './user.controller';
import { prisma } from '../../../lib/prisma';

const router = express.Router();
// auth(UserRole.TUTOR)
router.get("/users",auth(UserRole.ADMIN),userController.getAllUser)
router.put("/users",auth(UserRole.ADMIN),userController.userActionUpdated)
router.put("/user/profile", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, image }: {
      name: string;
      email: string;
      phone?: string;
      image?: string;
    } = req.body;

    // basic validation
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    const result = await prisma.user.update({
      where: { email },
      data: {
        name,
        phone: phone ?? null,
        image: image ?? null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });

  } catch (error) {
        if (error instanceof Error) {
                console.error(error.message);
                return res.status(500).json({
                error: "User profile Update  failed",
                message: error.message,
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "User profile Update",
                message: "Unknown error occurred",
            });
        
    }
});

export const users: Router = router;


export const tutorProfile: Router = router;