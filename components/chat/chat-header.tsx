import {Hash, Menu} from "lucide-react";
import MobileToggle from "../mobile-toggle";
import UserAvatar from "../user-avatar";
import {SocketIndicator} from "../socket-indicator";
import ChatVideoButton from "./chat-video-button";
// import SocketIndicator from "../socket-indicator";

type Props = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
};

function ChatHeader({serverId, name, type, imageUrl}: Props) {
  return (
    <div className="font-semibold px-3 flex items-center h-12 text-base border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2 rounded-full" />
      )}

      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="w-8 h-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-base text-black dark:text-white">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        {type == "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
}

export default ChatHeader;
