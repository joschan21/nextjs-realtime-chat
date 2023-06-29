import {Icon, Icons} from '@/Components/Icons/Icons'
import SignOutButton from '@/Components/Buttons/wrapper/SignOutButton'
import {authOptions} from '@/lib/auth'
import {getServerSession} from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ReactNode} from 'react'
import FriendRequestSidebarOptions from '@/Components/SideBar/FriendRequestSidebarOptions'
import {fetchRedis} from '@/helpers/redis'
import {getFriendsByUserId} from '@/helpers/get-friends-by-user-id'
import SidebarChatList from '@/Components/SideBar/SidebarChatList'
import MobileChatLayout from '@/Components/MobileChatLayout'
import {SidebarOption} from '@/types/typings'
import GroupRequestSidebarOptions from "@/Components/SideBar/GroupRequestSidebarOptions";
import SidebarGroupChatList from "@/Components/SideBar/SidebarGroupChatList";

interface LayoutProps {
    children: ReactNode
}

// Done after the video and optional: invite page metadata
export const metadata = {
    title: 'FriendZone | Dashboard',
    description: 'Your dashboard',
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/friend/add',
        Icon: 'UserPlus',
    },
    {
        id: 2,
        name: 'Create Group',
        href: '/dashboard/group/create',
        Icon: 'Plus',
    },
    {
        id: 3,
        name: 'Join Group',
        href: '/dashboard/group/join',
        Icon: 'Merge',
    },
    {
        id: 4,
        name: 'Invite to join Group',
        href: '/dashboard/group/invite',
        Icon: 'Merge',
    },
]

const Layout = async ({children}: LayoutProps) => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const friends = await getFriendsByUserId(session.user.id)


    const unseenFriendRequestCount = (
        (await fetchRedis(
            'smembers',
            `user:${session.user.id}:incoming_friend_requests`
        )) as User[]
    ).length

    const groups = (await fetchRedis(
        'smembers',
        `user:${session.user.id}:groups`,
    )) as string[]

    let incomingSenderIdsPromises: Promise<string[]>[] = []

    groups.map(async (group) => {
        incomingSenderIdsPromises.push(fetchRedis(
            'smembers',
            `group:${group}:incoming_group_requests`,
        ))


    })

    const incomingSenderIds = await Promise.all(incomingSenderIdsPromises) as string[][];

    const unseenJoinGroupRequestCount = incomingSenderIds.flat().length


    return (
        <div className='w-full flex h-screen'>
            <div className='md:hidden'>
                <MobileChatLayout
                    friends={friends}
                    groups={groups}
                    session={session}
                    sidebarOptions={sidebarOptions}
                    unseenFriendRequestCount={unseenFriendRequestCount}
                />
            </div>

            <div
                className='hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                <Link href='/dashboard' className='flex h-16 shrink-0 items-center'>
                    <Icons.Logo className='h-8 w-auto text-indigo-600'/>
                </Link>


                <nav className='flex flex-1 flex-col'>
                    <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        <li>
                            {friends.length > 0 ? (
                                <>

                                    <div className='text-xs font-semibold leading-6 text-gray-400'>
                                        Your chats
                                    </div>
                                    <SidebarChatList sessionId={session.user.id} friends={friends}/>   </>
                            ) : null}


                        </li>
                        <li>
                            {groups.length > 0 ? (
                                <>
                                    <div className='text-xs font-semibold leading-6 text-gray-400'>
                                        Your Groups
                                    </div>
                                    <SidebarGroupChatList session={session} groups={groups}/>
                                </>
                            ) : null}


                        </li>
                        <li>
                            <div className='text-xs font-semibold leading-6 text-gray-400'>
                                Overview
                            </div>

                            <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sidebarOptions.map((option) => {
                                    const Icon = Icons[option.Icon]
                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                        <span
                            className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                          <Icon className='h-4 w-4'/>
                        </span>

                                                <span className='truncate'>{option.name}</span>
                                            </Link>
                                        </li>
                                    )
                                })}

                                <li>
                                    <FriendRequestSidebarOptions
                                        sessionId={session.user.id}
                                        initialUnseenFriendRequestCount={unseenFriendRequestCount}
                                    />
                                </li>
                                <li>
                                    <GroupRequestSidebarOptions
                                        sessionId={session.user.id}
                                        initialUnseenGroupRequestCount={unseenJoinGroupRequestCount}
                                    />
                                </li>
                            </ul>
                        </li>

                        <li className='-mx-6 mt-auto flex items-center'>
                            <div
                                className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                    <Image
                                        fill
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session.user.image || ''}
                                        alt='Your profile picture'
                                    />
                                </div>

                                <span className='sr-only'>Your profile</span>
                                <div className='flex flex-col'>
                                    <span aria-hidden='true'>{session.user.name}</span>
                                    <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session.user.email}
                  </span>
                                </div>
                            </div>
                            <SignOutButton className='h-full aspect-square'/>
                        </li>
                    </ul>
                </nav>
            </div>

            <aside className='max-h-screen container py-16 md:py-12 w-full'>
                {children}
            </aside>
        </div>
    )
}

export default Layout
