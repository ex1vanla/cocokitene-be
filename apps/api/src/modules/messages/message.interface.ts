export interface DataChatResponseDetail {
    rootChat: number
    messageChat: DataMessageChat[]
}
export interface DataMessageChat {
    senderId: number
    receiverId: number
    content: string
    createdAt: Date
    replyMessageId?: number
}
