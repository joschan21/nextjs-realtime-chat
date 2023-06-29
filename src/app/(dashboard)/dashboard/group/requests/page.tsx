import GroupRequests from '@/Components/SideBar/GroupRequests'
import {fetchRedis} from '@/helpers/redis'
import {authOptions} from '@/lib/auth'
import {getServerSession} from 'next-auth'
import {notFound} from 'next/navigation'


const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    // get all user's groups
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


    // ids of people who sent current logged-in user a group requests
    let incomingGroupRequests: IncomingGroupRequest[] = [];
    // get all incoming group requests
    if (incomingSenderIds && incomingSenderIds.flat().length >= 1) incomingGroupRequests = await Promise.all(
        incomingSenderIds.flat().map(async (senderId, groupId) => {

            const sender = (await fetchRedis('get', `user:${senderId}`)) as string
            const senderParsed = JSON.parse(sender) as User

            return {
                senderId,
                senderEmail: senderParsed.email,
                groupName: groups[groupId]
            }
        })
    )

    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Add a group to your group</h1>
            <div className='flex flex-col gap-4'>
                <GroupRequests
                    incomingGroupRequests={incomingGroupRequests}
                    sessionId={session.user.id}
                />
            </div>
        </main>
    )
}

export default page
