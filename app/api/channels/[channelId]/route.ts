import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE (request: Request, { params: { channelId }}: { params: { channelId: string }}) {
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(request.url);
        const serverId = searchParams.get('serverId');
        if(!profile) {
            return new NextResponse('Unauthorized', { status: 401})
        }

   

        if(!serverId) {
            return new NextResponse('Server id mising', { status: 400})
        
        };

        const server = await db.server.update({
            where: {
              id: serverId,
              members: {
                some: {
                  profleId: profile.id,
                  role: {
                    in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                  }
                }
              }
            },
            data: {
              channels: {
                delete: {
                  id: channelId,
                  name: {
                    not: "general",
                  }
                }
              }
            }
          });
          return NextResponse.json(server);
      



        }
    

        
     catch (error) {
        console.log('CHANNEL_DELETE_ERROR', error);
        return new NextResponse('Internal Server Error', { status: 500})
        
    }
}
export async function PATCH (request: Request, { params: { channelId }}: { params: { channelId: string }}) {
    try {
        const profile = await currentProfile();
        const { name, type } = await request.json();
        const {searchParams} = new URL(request.url);
        const serverId = searchParams.get('serverId');
        if(!profile) {
            return new NextResponse('Unauthorized', { status: 401})
        }

   

        if(!serverId) {
            return new NextResponse('Server id mising', { status: 400})
        
        };
        if(!channelId) {
            return new NextResponse('Channel id mising', { status: 400})
        
        };

        if(name === "general") {
          return new NextResponse("Name cannot be 'general' ", { status: 400 })
        }

        const server = await db.server.update({
            where: {
              id: serverId,
              members: {
                some: {
                  profleId: profile.id,
                  role: {
                    in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                  }
                }
              }
            },
            data: {
             channels: {
              update: {
                where: {
                  id: channelId,
                  NOT: {
                    name: "general"
                  }
                },
                data: {
                  name,
                  type
                }
              },
              
             }
            }
          });
          return NextResponse.json(server);
      



        }
    

        
     catch (error) {
        console.log('CHANNEL_PATCH_ERROR', error);
        return new NextResponse('Internal Server Error', { status: 500})
        
    }
}