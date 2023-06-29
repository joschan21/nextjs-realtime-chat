interface IncomingFriendRequest {
    senderId: string
    senderEmail: string | null | undefined
}

interface IncomingGroupRequest extends IncomingFriendRequest {
    groupName: string
}