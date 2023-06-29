import {getFriendsByUserId} from '@/helpers/get-friends-by-user-id'
import {fetchRedis} from '@/helpers/redis'
import {authOptions} from '@/lib/auth'
import {chatHrefConstructor} from '@/lib/utils'
import {ChevronRight} from 'lucide-react'
import {getServerSession} from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getUsersGroups} from "@/helpers/get-users-groups";

const page = async ({}) => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const [friends, groups] = await Promise.all([getFriendsByUserId(session.user.id), getUsersGroups(session.user.id)])


    const friendsWithLastMessage = await Promise.all(
        friends.map(async (friend) => {
            const [lastMessageRaw] = (await fetchRedis(
                'zrange',
                `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
                -1,
                -1
            )) as string[]


            const lastMessage = JSON.parse(lastMessageRaw || '{}') as Message

            return {
                ...friend,
                lastMessage,
            }
        }),
    )
    const groupsWithLastMessage = await Promise.all(
        groups.map(async (group) => {
            const [lastMessageRaw] = (await fetchRedis(
                'zrange',
                `chat:${group}:messages`,
                -1,
                -1
            )) as string[]

            const lastMessage = JSON.parse(lastMessageRaw || '{}') as Message

            return {
                group,
                lastMessage,
            }
        })
    )

    return (
        <div className='container py-12'>
            <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
            {friendsWithLastMessage.length + groupsWithLastMessage.length === 0 ? (
                    <p className='text-sm text-zinc-500'>Nothing to show here...</p>
                ) :
                (
                    [...friendsWithLastMessage, ...groupsWithLastMessage].sort((i, j) => i.lastMessage.timestamp - j.lastMessage.timestamp).map((friendOrGroup) => (
                        <div
                            key={"id" in friendOrGroup ? friendOrGroup.id : friendOrGroup.group}
                            className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md mb-1'>
                            <div className='absolute right-4 inset-y-0 flex items-center'>
                                <ChevronRight className='h-7 w-7 text-zinc-400'/>
                            </div>

                            <Link
                                href={"id" in friendOrGroup ?
                                    `/dashboard/friend/chat/${chatHrefConstructor(
                                        session.user.id,
                                        friendOrGroup.id
                                    )}`
                                    : '/dashboard/group/chat/' + friendOrGroup.group

                                }
                                className='relative sm:flex'>
                                <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4 '>
                                    <div className='relative h-6 w-6'>
                                        {"image" in friendOrGroup &&
                                            <Image
                                                referrerPolicy='no-referrer'
                                                className='rounded-full'
                                                alt={`${friendOrGroup.name} profile picture`}
                                                src={friendOrGroup.image}
                                                fill
                                            />


                                        }
                                    </div>
                                </div>

                                <div>
                                    <h4 className='text-lg font-semibold'>{"name" in friendOrGroup ? friendOrGroup.name : friendOrGroup.group}</h4>
                                    <p className='mt-1 max-w-md'>
                  <span className='text-zinc-400'>
                    {friendOrGroup.lastMessage.senderId === session.user.id
                        ? 'You: '
                        : ''}
                  </span>
                                        {friendOrGroup.lastMessage.text}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))


                )}
        </div>
    )
}

export default page
