import {fetchRedis} from './redis'

export const getUsersGroups = async (userId: string): Promise<string[]> => {
    // retrieve friends for current user
    // console.log("userid", userId)
    // console.log("friend ids", friendIds)

    return (await fetchRedis(
        'smembers',
        `user:${userId}:groups`
    )) as string[];
}
