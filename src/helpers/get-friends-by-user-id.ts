import {fetchRedis} from './redis'

export const getFriendsByUserId = async (userId: string) => {
  // retrieve friends for current user
  // console.log("userid", userId)
  const friendIds = (await fetchRedis(
    'smembers',
    `user:${userId}:friends`
  )) as string[]
  // console.log("friend ids", friendIds)

  return await Promise.all(
      friendIds.map(async (friendId) => {
          const friend = await fetchRedis('get', `user:${friendId}`) as string
          return JSON.parse(friend) as User
      })
  )
}
