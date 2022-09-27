import { useEffect, useRef, useState } from "react"
import {
    GetMessageProtocol,
    GetUsersProtocol,
    HelloProtocol,
    MessageProtocol,
    PostMessageProtocol,
    StreamProtocol,
    UpdateMessageProtocol,
    UpdateProtocol,
    UpdateUserProtocol,
    UserProtocol,
} from "../utils/protocol"
import { Secret } from "../utils/secret"

export const useChat = (clientId: string) => {
    const [users, setUsers] = useState<Record<string, UserProtocol>>({})
    const [messages, setMessages] = useState<MessageProtocol[]>([])

    const socketRef = useRef<WebSocket>()
    const [isConnected, setIsConnected] = useState(false)

    const connect = () => {
        socketRef.current = new WebSocket(Secret.NEXT_PUBLIC_STREAM_SERVER)
        socketRef.current.onopen = async () => {
            console.log("WebSocket open")

            while (socketRef.current?.readyState === WebSocket.CONNECTING) {
                await new Promise((resolve) => setTimeout(resolve, 100))
            }

            if (socketRef.current?.readyState === WebSocket.OPEN) {
                hello()
                setIsConnected(true)
            }
        }
        socketRef.current.onmessage = (event) => {
            const data: StreamProtocol = JSON.parse(event.data)
            switch (data.type) {
                case "Update": {
                    console.log("Update messages")
                    const payload: UpdateProtocol = data as UpdateProtocol
                    if (payload.data.target === "Messages") {
                        const update: UpdateMessageProtocol = payload as UpdateMessageProtocol
                        updateMessages(update.data.messages)
                    } else if (payload.data.target === "Users") {
                        const update: UpdateUserProtocol = payload as UpdateUserProtocol
                        updateUsers(update.data.users)
                    }

                    break
                }
                default: {
                    break
                }
            }
        }
        socketRef.current.onclose = () => {
            console.log("WebSocket closed")
            setIsConnected(false)
        }
    }

    const hello = () => {
        const hello: HelloProtocol = {
            type: "Hello",
            data: {
                id: clientId,
            },
        }
        try {
            socketRef.current?.send(JSON.stringify(hello))
        } catch {
            console.log("Hello failed")
            setIsConnected(false)
        }
    }

    const getUsers = async () => {
        const get: GetUsersProtocol = {
            type: "Get",
            data: {
                id: clientId,
                target: "Users",
            },
        }
        try {
            socketRef.current?.send(JSON.stringify(get))
        } catch {
            console.log("Get users failed")
            setIsConnected(false)
        }
    }

    const getMessages = async (count: number, before?: string) => {
        const payload: GetMessageProtocol = {
            type: "Get",
            data: {
                id: clientId,
                target: "Messages",
                count,
                before,
            },
        }
        try {
            socketRef.current?.send(JSON.stringify(payload))
        } catch {
            console.log("Get messages failed")
            setIsConnected(false)
        }
    }

    const postMessage = async (username: string, message: string) => {
        const payload: PostMessageProtocol = {
            type: "Post",
            data: {
                id: clientId,
                target: "Message",
                username,
                message,
            },
        }
        try {
            socketRef.current?.send(JSON.stringify(payload))
        } catch {
            console.log("Post message failed")
            setIsConnected(false)
        }
    }

    const updateMessages = (newMessages: MessageProtocol[]) => {
        setMessages((msgs) => {
            return Array.from(new Set(newMessages.concat(msgs))).sort((a, b) => (a.date < b.date ? 1 : -1))
        })
    }

    const updateUsers = (userList: UserProtocol[]) => {
        userList.forEach((u) => {
            setUsers((prev) => {
                return {
                    ...prev,
                    [u.id]: u,
                }
            })
        })
    }

    return { users, messages, isConnected, connect, hello, getUsers, getMessages, postMessage }
}
