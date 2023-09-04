import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {redirectToSignIn} from "@clerk/nextjs";
import {redirect} from "next/navigation";

type Props = {
  params: {
    serverId: string;
  };
};

async function ServerPage({params: {serverId}}: Props) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profleId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];
  if (initialChannel?.name !== "general") return;

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
}

export default ServerPage;
