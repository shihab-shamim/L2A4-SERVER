import { prisma } from "../../../lib/prisma";
import { TutorProfile } from "./tutorProfile";

export const createTutorProfile = async (data: TutorProfile) => {
  const result = await prisma.tutorProfile.create({data});

  return result;

};


export const tutorProfileService={
    createTutorProfile

}