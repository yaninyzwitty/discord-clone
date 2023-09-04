"use client";

import {useChatQuery} from "@/hooks/use-chat-query";
import {Member, Message, Profile} from "@prisma/client";
import {format} from "date-fns";
import {Loader2, Loader2Icon, ServerCrash} from "lucide-react";
import {Fragment, useRef, ElementRef} from "react";
import ChatItem from "./chat-item";
import ChatWelcome from "./chat-welcome";
import {useChatSocket} from "@/hooks/use-chat-socket";
import {useChatScroll} from "@/hooks/use-chat-scroll";
type MessageWithMemberAndProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

type Props = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
};

const DATE_FORMAT = "d MMM yyyy HH:mm";
export default function ChatMessages({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  type,
  paramValue,
}: Props) {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const {data, isFetchingNextPage, fetchNextPage, hasNextPage, status} =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  });
  useChatScroll({
    chatRef,
    bottomeRef: bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Loading messages...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500  my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Something went wrong
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex-col flex py-4 overflow-y-auto" ref={chatRef}>
      {!hasNextPage && <div className="flex-1" />}

      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2Icon className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
              onClick={() => fetchNextPage()}
            >
              Load Previous Messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, idx) => (
          <Fragment key={idx}>
            {group?.items?.map((message: MessageWithMemberAndProfile) => (
              <ChatItem
                key={member.id}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                member={message.member}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                currentMember={member}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
