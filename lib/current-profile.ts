import { auth } from "@clerk/nextjs";
import { db } from "./db";

// check current profile

export const currentProfile = async () => { 

    const {userId} = auth();

    
    if(!userId) {
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId,
        }


    });


    return profile;
};