import express, { Response, Router,Request, NextFunction } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { prisma } from '../../../lib/prisma';


const router = express.Router();
router.post("/review",auth(UserRole.STUDENT), async (req: Request, res: Response) => {
  const { studentId, tutorId, rating, comment, bookingId } = req.body;

  if (req.user?.status === "BANNED") {
    return res.status(403).json({
      success: false,
      error: "You are banned",
      data: null,
    });
  }

  if (!studentId || !tutorId || !bookingId || rating === undefined || rating === null) {
    return res.status(400).json({
      error: "validation failed",
      message: "studentId, tutorId, bookingId, rating are required",
    });
  }

  const ratingNumber = Number(rating);
  if (Number.isNaN(ratingNumber)) {
    return res.status(400).json({
      error: "validation failed",
      message: "rating must be a number",
    });
  }

  const safeComment = typeof comment === "string" ? comment : "";

  try {
    const review = await prisma.review.create({
      data: {
        studentId,
        tutorId,
        rating: ratingNumber,
        comment: safeComment,

        // ✅ Option A: if your Review model has bookingId scalar field
        bookingId,

        // ✅ Option B (uncomment if your schema requires relation connect instead of bookingId scalar)
        // booking: { connect: { id: bookingId } },
      },
    });

    return res.status(201).json({ data: review, error: null });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: "review failed",
        message: error.message,
      });
    }
    return res.status(500).json({ error: "review failed" });
  }
});



export const review: Router = router;