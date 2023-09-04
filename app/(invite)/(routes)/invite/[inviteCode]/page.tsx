import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {redirectToSignIn} from "@clerk/nextjs";
import {redirect} from "next/navigation";

type Props = {
  params: {
    inviteCode: string;
  };
};

async function InviteCodePage({params: {inviteCode}}: Props) {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  if (!inviteCode) {
    return redirect("/");
  }

  //   match && already member
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profleId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profleId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
}

export default InviteCodePage;
