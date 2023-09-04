import { useEffect, useState } from "react";

type Props = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomeRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;

}


export const useChatScroll = ({ chatRef, bottomeRef, shouldLoadMore, loadMore, count }: Props) => {
    const [hasInitialized, setHasInitalized] = useState(false);

    useEffect(() => {
        const topDIV = chatRef.current;
        const handleScroll = () => {
            const scrollTop = topDIV?.scrollTop;

            if(scrollTop === 0 && shouldLoadMore) {
                loadMore()
            }
        }

        topDIV?.addEventListener('scroll', handleScroll);
        return () => {
            topDIV?.removeEventListener('scroll', handleScroll);
        }

    }, [shouldLoadMore, loadMore, chatRef]);
    useEffect(() => {
        const bottomDiv = bottomeRef?.current;
        const topDiv = chatRef?.current;

        const shouldAutoScroll = () => {
            if(!hasInitialized && bottomDiv) {
                setHasInitalized(true)
                return true;
            }
            if(!topDiv) {
                return false;
            }
            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <= 100;
        }
        if(shouldAutoScroll()) {
            setTimeout(() => {
                bottomeRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        }


    }, [bottomeRef, chatRef, hasInitialized, count])

}

