import {fetchRedis} from '@/helpers/redis'
import {authOptions} from '@/lib/auth'
import {db} from '@/lib/db'
import {getServerSession} from 'next-auth'
import {z} from 'zod'
import {GroupValidator} from "@/lib/validations/add-group";

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const {group_name} = GroupValidator.parse({group_name: body.group_name})


        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response('Unauthorized', {status: 401})
        }
        //check if a group exists already with this name
        const group: 0 | 1 = await fetchRedis(
            'exists',
            `group:${group_name}:group-members`
        )
        if (group === 1) return new Response('A group exists with this name', {status: 400})

        //1_ add user to group members to receive messages
        //2_ append the group to the user groups(owner)

        await Promise.all([
            db.sadd(`group:${group_name}:group-members`, session.user.id),
            db.sadd(`user:${session.user.id}:groups`, group_name),
            db.sadd(`group:${group_name}:group-admins`, session.user.id),
            // pusherServer.trigger(toPusherKey(`group-${group_name}`), 'group-created', {
            //     group_name,
            // })
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
