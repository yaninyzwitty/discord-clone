"use client";

import qs from "query-string";

import {usePathname, useSearchParams} from "next/navigation";
import {Video, VideoOff} from "lucide-react";
import ActionTooltip from "../navigation/action-tooltip";
import {useRouter} from "next/navigation";

function ChatVideoButton() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      {skipNull: true}
    );

    router.push(url);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button>
        <Icon
          className="h-6 w-6 text-zinc-500 dark:text-zinc-400 transition hover:opacity-75 mr-4"
          onClick={onClick}
        />
      </button>
    </ActionTooltip>
  );
}

export default ChatVideoButton;
