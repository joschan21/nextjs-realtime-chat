import {authOptions} from '@/lib/auth'
import {db} from '@/lib/db'
import {getServerSession} from 'next-auth'
import {z} from 'zod'
import {fetchRedis} from "@/helpers/redis";

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {id: idToDeny, groupName} = z.object({id: z.string(), groupName: z.string()}).parse(body)

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


        await db.srem(`group:${groupName}:incoming_group_requests`, idToDeny)

        return new Response('OK')
    } catch
        (error) {
        console.error(error)

        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload', {status: 422})
        }

        return new Response('Invalid request', {status: 400})
    }
}
