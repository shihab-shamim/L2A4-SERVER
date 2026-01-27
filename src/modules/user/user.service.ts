import { prisma } from "../../../lib/prisma";
// import { TutorProfile } from "./tutorProfile";

 const getAllUser = async () => {
  const result = await await prisma.user.findMany()

  return result;

};

const userActionUpdated =async(email:string,status:"ACTIVE" | "BANNED") =>{
    const result =await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        status: status,
      },
    });
    return result
    
}



export const userService={
    getAllUser,userActionUpdated

}