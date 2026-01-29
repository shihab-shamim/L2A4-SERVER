
import express, { Response, Router,Request, NextFunction } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { prisma } from '../../../lib/prisma';

const router = express.Router();

router.post("/booking", async (req: Request, res: Response) => {
  const { slotId, studentId, tutorId, startTime, endTime } = req.body;

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
    const [studentExists, tutorExists, slot] = await Promise.all([
      prisma.user.findUnique({ where: { id: studentId } }),
      prisma.user.findUnique({ where: { id: tutorId } }),
      prisma.availabilitySlot.findUnique({ where: { id: slotId } }),
    ]);

    if (!studentExists) return res.status(404).json({ error: "student not found" });
    if (!tutorExists) return res.status(404).json({ error: "tutor not found" });
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







export const booking: Router = router;