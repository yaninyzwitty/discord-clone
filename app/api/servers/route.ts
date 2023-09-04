import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid"

export async function POST (req: Request, res: Response) {
    try {
        
        const { name, imageUrl} = await req.json();
        const profile = await currentProfile();

        if(!profile) {
            return new NextResponse("Unauthorized", {
                status: 401
            })
        };



        // initial memeber who creates server will be ab admin
        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuid(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id },
                    ]
                },
                members: {
                    create: [
                        { profleId: profile.id, role: MemberRole.ADMIN },
                    ]
                }
            }
        });

        return NextResponse.json(server)




        
    } catch (error) {
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Server Error", {
            status: 500
        })


    }
}