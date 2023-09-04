import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import {MediaRoom} from "@/components/media-room";
import {getOrCreateConversation} from "@/lib/conversation";
import {currentProfile} from "@/lib/current-profile";
import {db} from "@/lib/db";
import {redirectToSignIn} from "@clerk/nextjs";
import {redirect} from "next/navigation";

type Props = {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
};

async function MemberIdPage({
  params: {memberId, serverId},
  searchParams,
}: Props) {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profleId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!profile) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember?.id!,
    memberId
  );

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const {memberOne, memberTwo} = conversation;

  const otherMember =
    memberOne?.profleId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember?.profile?.imageUrl}
        name={otherMember?.profile?.name}
        serverId={serverId}
        type="conversation"
      />
      {searchParams.video && <MediaRoom chatId={conversation.id} video audio />}
      {!searchParams.video && (
        <>
          <ChatMessages
            // @ts-ignore
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          {/* <ChatInput /> */}
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
}

export default MemberIdPage;
