import {fetchRedis} from '@/helpers/redis'
import {authOptions} from '@/lib/auth'
import {db} from '@/lib/db'
import {getServerSession} from 'next-auth'
import {z} from 'zod'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {id: idToAdd, groupName} = z.object({id: z.string(), groupName: z.string()}).parse(body)

        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return new Response('Unauthorized', {status: 401})
        }
        //verfiy the user is the owner of the group
        const isAdmin = await fetchRedis(
            'sismember',
            `group:${groupName}:group-admins`,
            session.user.id
        ) as 1 | 0

        if (isAdmin === 0) {
            return new Response('Unauthorized', {status: 401})
        }


        // verify  user exist
        const userExists = await fetchRedis('exists', `user:${session.user.id}`)
        if (!userExists) {
            return new Response('Unauthorized', {status: 401})
        }
        //verify group exists
        const groupExists = await fetchRedis('exists', `group:${groupName}:group-members`)
        if (!groupExists) {
            return new Response('Group does not exist', {status: 404})
        }


        // verify both users are not already friends
        const isAlreadyJoined = await fetchRedis(
            'sismember',
            `group:${session.user.id}:friends`,
            idToAdd
        )

        if (isAlreadyJoined) {
            return new Response('Already joind', {status: 400})
        }

        const [userRaw, friendRaw] = (await Promise.all([
            fetchRedis('get', `user:${session.user.id}`),
            fetchRedis('get', `user:${idToAdd}`),
        ])) as [string, string]

        // const user = JSON.parse(userRaw) as User
        // const friend = JSON.parse(friendRaw) as User

        // notify added user

        await Promise.all([
            // pusherServer.trigger(
            //     toPusherKey(`user:${idToAdd}:friends`),
            //     'new_member',
            //     user
            // ),
            // pusherServer.trigger(
            //     toPusherKey(`user:${session.user.id}:friends`),
            //     'new_member',
            //     friend
            // ),
            db.sadd(`group:${groupName}:group-members`, idToAdd),
            db.sadd(`user:${idToAdd}:groups`, groupName),
            db.srem(`group:${groupName}:incoming_group_requests`, idToAdd),
        ])

        return new Response('OK')
    } catch (error) {
        console.error(error)

        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }

        return new Response('Invalid request', {status: 400})
    }
}
