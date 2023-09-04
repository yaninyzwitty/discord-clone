import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { profileEnd } from "console";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params: { serverId }}: { params: { serverId: string }}) {
    try {
        const profile = await currentProfile();
        if(!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        
        };
        if(!serverId) {
            return new NextResponse('Missing server id', { status: 400 })
        
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id,
                },
                members: {
                    some: {
                        profleId: profile.id,
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profleId: profile.id,
                    }
                }
            }
            
        });

        return NextResponse.json(server);

    }



        
     catch (error) {
        console.log('SERVER_ID_LEAVE_ERROR', error);
        return new NextResponse('Internal Error', { status: 500 })
    
        
    }

}