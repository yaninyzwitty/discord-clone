import InitialModal from "@/components/modals/initial-modal";
import {db} from "@/lib/db";
import {initialProfile} from "@/lib/initial-profile";
import {redirect} from "next/navigation";

async function SetupPage() {
  const profile = await initialProfile();

  //   attempt to find server that this profile is a member of profile id memeber of that server
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profleId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return <InitialModal />;
}

export default SetupPage;
