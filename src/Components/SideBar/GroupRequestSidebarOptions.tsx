'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import { User } from 'lucide-react'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'

interface GroupRequestSidebarOptionsProps {
  sessionId: string
  initialUnseenGroupRequestCount: number
}

const GroupRequestSidebarOptions: FC<GroupRequestSidebarOptionsProps> = ({
  sessionId,
  initialUnseenGroupRequestCount,
}) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenGroupRequestCount
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_group_requests`)
    )
    // pusherClient.subscribe(toPusherKey(`user:${sessionId}:groups`))

    const groupRequestHandler = () => {
      setUnseenRequestCount((prev) => prev + 1)
    }

    const addedGroupHandler = () => {
      setUnseenRequestCount((prev) => prev - 1)
    }

    pusherClient.bind('incoming_group_requests', groupRequestHandler)
    pusherClient.bind('new_group', addedGroupHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_group_requests`)
      )
      // pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:groups`))

      pusherClient.unbind('new_group', addedGroupHandler)
      pusherClient.unbind('incoming_group_requests', groupRequestHandler)
    }
  }, [sessionId])

  return (
    <Link
      href='/dashboard/group/requests'
      className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
      <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
        <User className='h-4 w-4' />
      </div>
      <p className='truncate'>Group requests</p>

      {unseenRequestCount > 0 ? (
        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  )
}

export default GroupRequestSidebarOptions
