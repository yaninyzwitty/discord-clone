// load initial profiles
import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";


export const initialProfile = async () => {
    const user = await currentUser();
    if(!user) {
        return redirectToSignIn();

    }

    // check if theres a profile
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id,
        }
    });


    if(profile) {
        return profile;
    };


    // if no profile found, create one
    const newProfile = db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user?.imageUrl,
            email: user?.emailAddresses[0].emailAddress
        }
    });

    return newProfile;

}