
import express, { Response, Router,Request, NextFunction } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { prisma } from '../../../lib/prisma';

const router = express.Router();

router.post("/booking",auth(UserRole.STUDENT), async (req: Request, res: Response) => {
  const { slotId, studentId, tutorId, startTime, endTime } = req.body;
      if(req.user?.status === "BANNED"){
        return res.status(404).json({
        success: false,
        error: "Tutor profile not Update ! You are Banned",
        data: null,
      });
    }

  if (!slotId || !studentId || !tutorId || !startTime || !endTime) {
    return res.status(400).json({
      error: "validation failed",
      message: "slotId, studentId, tutorId, startTime, endTime are required",
    });
  }

  const s = new Date(startTime);
  const e = new Date(endTime);

  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
    return res.status(400).json({
      error: "validation failed",
      message: "startTime/endTime must be valid ISO datetime strings",
    });
  }

  if (e <= s) {
    return res.status(400).json({
      error: "validation failed",
      message: "endTime must be after startTime",
    });
  }

  try {
    // Ensure foreign keys exist
    const [slot] = await Promise.all([
      prisma.availabilitySlot.findUnique({ where: { id: slotId } }),
    ]);


    if (!slot) return res.status(404).json({ error: "slot not found" });

    if (slot.isBooked) {
      return res.status(409).json({
        error: "slot already booked",
      });
    }

    // ✅ Transaction: booking create + slot update
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          studentId,
          tutorId,
          slotId,
          startTime: s,
          endTime: e,
        },
      });

      await tx.availabilitySlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return booking;
    });

    return res.status(201).json({ data: result, error: null });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: "booking failed",
        message: error.message,
      });
    }
    return res.status(500).json({ error: "booking failed" });
  }
});
router.get("/booking/:id",auth(UserRole.STUDENT),async(req: Request, res: Response)=>{

    const {id}=req.params ;
    try {
        const result=await prisma.booking.findMany({where:{studentId:id as string}})
        if(result){
             return res.status(200).json({
                data:result,
             error: null,
      
      });
        }
        
    }  catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: "booking get failed",
        message: error.message,
      });
    }
    return res.status(500).json({ error: "booking get failed" });
  }
})

router.patch(
  "/booking/:id/cancel",
  auth(UserRole.STUDENT),
  async (req: Request, res: Response) => {
    console.log("params", req.params.id);

    const { id } = req.params; // bookingId

    try {
      // booking exists?
      const booking = await prisma.booking.findUnique({
        where: { id: id as string },
        select: { id: true, studentId: true, slotId: true, status: true },
      });

      if (!booking) {
        return res.status(404).json({
          data: null,
          error: "booking not found",
        });
      }

      // already cancelled?
      if (booking.status === "CANCELLED") {
        return res.status(409).json({
          data: null,
          error: "booking already cancelled",
        });
      }

      // ✅ Transaction: cancel booking + free slot
      const result = await prisma.$transaction(async (tx) => {
        const updatedBooking = await tx.booking.update({
          where: { id: booking.id },
          data: { status: "CANCELLED" },
        });

        if (booking.slotId) {
          await tx.availabilitySlot.update({
            where: { id: booking.slotId },
            data: { isBooked: false },
          });
        }

        return updatedBooking;
      });

      return res.status(200).json({
        data: result,
        error: null,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({
          error: "booking cancel failed",
          message: error.message,
        });
      }
      return res.status(500).json({ error: "booking cancel failed" });
    }
  }
);
router.get("/booking",auth(UserRole.ADMIN),async(req: Request, res: Response)=>{

    try {
        const result=await prisma.booking.findMany()
        if(result){
             return res.status(200).json({
                data:result,
             error: null,
      
      });
        }
        
    }  catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: "booking get failed",
        message: error.message,
      });
    }
    return res.status(500).json({ error: "booking get failed" });
  }
})







export const booking: Router = router;