import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function DELETE(request: Request, { params: { memberId }}: { params: { memberId: string }}) {
  try {
    const profile = await currentProfile();
    const searchParams = new URL(request.url);
    const serverId = searchParams.searchParams.get('serverId');

    if(!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if(!serverId) {
      return new NextResponse('Server id missing', { status: 400 })
    
    };

    if(!memberId) {
      return new NextResponse('Member id missing', { status: 400 })
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profleId: {
              not: profile.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    });

    return NextResponse.json(server);

    
    
    



    
    
  } catch (error) {
    console.log("MEMEBER_ID_DELETE", error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }


    
  

}

export async function PATCH(request: Request, { params: { memberId }}: { params: { memberId: string } }) {
    try {
        const profile = await currentProfile();
        const searchParams = new URL(request.url);
        const { role } = await request.json();
        const serverId = searchParams.searchParams.get('serverId');

        if(!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        
        }
        
        if(!serverId) {
            return new NextResponse('Server id missing', { status: 400 })
        
        }

        if(!memberId) {
            return new NextResponse('Member id missing', { status: 400 })
        
        
        };

        const server = await db.server.update({
            where: {
              id: serverId,
              profileId: profile.id,
            },
            data: {
              members: {
                update: {
                  where: {
                    id: memberId,
                    profleId: {
                      not: profile.id
                    }
                  },
                  data: {
                    role
                  }
                }
              }
            },
            include: {
              members: {
                include: {
                  profile: true,
                },
                orderBy: {
                  role: "asc"
                }
              }
            }
          });
      return NextResponse.json(server);


      



        
    } catch (error) {
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}