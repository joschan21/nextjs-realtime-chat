import {fetchRedis} from '@/helpers/redis'
import {authOptions} from '@/lib/auth'
import {db} from '@/lib/db'
import {pusherServer} from '@/lib/pusher'
import {toPusherKey} from '@/lib/utils'
import {getServerSession} from 'next-auth'
import {z} from 'zod'
import {InviteUserToGroupValidator} from "@/lib/validations/add-group";

export async function POST(req: Request) {
    try {
        const body = await req.json()


        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', {status: 401})
        }

        const {group_name, email} = InviteUserToGroupValidator.parse({
            email: body.user_email,
            group_name: body.group_name
        })
        // check if the user is the owner of the group ( has permission to invite )
        const isGroupOwner = (await fetchRedis(
            'sismember',
            `group:${group_name}:group-admins`,
            session.user.id
        )) as 0 | 1

        if (isGroupOwner === 0) return new Response('You are not the owner of this group', {status: 400})


        // check if the group exist
        const isGroupExists = await fetchRedis(
            'exists',
            `group:${group_name}:group-members`
        ) as 0 | 1

        if (isGroupExists === 0) return new Response('This group does not exist.', {status: 400})

        // check if the user exists
        const isUserExists = (await fetchRedis(
            'exists',
            `user:email:${email}`
        )) as 0 | 1

        if (!isUserExists) {
            return new Response('This person does not exist.', {status: 400})
        }

        // check if user is already added
        const isAlreadySendJoinRequest = (await fetchRedis(
            'sismember',
            `group:${group_name}:incoming_group_requests`,
            session.user.id
        )) as 0 | 1

        if (isAlreadySendJoinRequest) {
            return new Response('Already send a request to invite this group please wait', {status: 400})
        }

        // check if user is already added
        const isAlreadyJoined = (await fetchRedis(
            'sismember',
            `group:${group_name}:group-members`,
            session.user.id
        )) as 0 | 1

        if (isAlreadyJoined === 1) {
            return new Response('Already joined this group', {status: 400})
        }


        const groupOwnerId = (await fetchRedis(
            'smembers',
            `group:${group_name}:group-admins`
        ))[0] as string


        // valid request, send friend request
        await pusherServer.trigger(
            toPusherKey(`user:${groupOwnerId}:incoming_group_requests`),
            'incoming_group_requests',
            {
                senderId: session.user.id,
                senderEmail: session.user.email,
                groupName: group_name,
            }
        )

        await db.sadd(`group:${group_name}:incoming_group_requests`, session.user.id)

        return new Response('OK')
    } catch (error) {
        console.error(error)
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }

        return new Response('Invalid request', {status: 400})
    }
}
