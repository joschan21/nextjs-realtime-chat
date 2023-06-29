'use client'

import {FC, useEffect, useState} from 'react'
import Link from "next/link";
import {Session} from "next-auth";
import {pusherClient} from "@/lib/pusher";
import {chatHrefConstructor, toPusherKey} from "@/lib/utils";
import {toast} from "react-hot-toast";
import UnseenChatToast from "@/Components/UnseenChatToast";
import {usePathname, useRouter} from "next/navigation";

interface SidebarGroupChatListProps {
    groups: string[]
    session: Session
}

interface ExtendedMessage extends Message {
    senderImg: string
    senderName: string
}

const SidebarGroupChatList: FC<SidebarGroupChatListProps> = ({groups, session}) => {

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const router = useRouter()
    const pathname = usePathname()


    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${session.user.id}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`))

        const newFriendHandler = (newFriend: User) => {
            console.log(newFriend)
        }

        const chatHandler = (message: ExtendedMessage) => {
            const shouldNotify =
                pathname !==
                `/dashboard/chat/${chatHrefConstructor(session.user.id, message.senderId)}`

            if (!shouldNotify) return

            // should be notified
            toast.custom((t) => (
                <UnseenChatToast
                    t={t}
                    sessionId={session.user.id}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderMessage={message.text}
                    senderName={message.senderName}
                />
            ))

            setUnseenMessages((prev) => [...prev, message])
        }

        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', newFriendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:friends`))

            pusherClient.unbind('new_message', chatHandler)
            pusherClient.unbind('new_friend', newFriendHandler)
        }
    }, [pathname, session.user.id, router])


    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            {groups.sort().map((group, i) => {

                    const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                        return unseenMsg.senderId !== session.user.id
                    }).length


                    return (<li key={i}>
                        <Link
                            href={`/dashboard/group/chat/${group}`}
                            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                            {group}
                            {unseenMessagesCount > 0 ? (
                                <div
                                    className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                                    {unseenMessagesCount}
                                </div>
                            ) : null}
                        </Link>
                    </li>)
                }
            )
            }


        </ul>
    )
}

export default SidebarGroupChatList
