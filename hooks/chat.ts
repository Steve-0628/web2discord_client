import { useEffect, useRef, useState } from "react"
import {
    GetMessageProtocol,
    GetUsersProtocol,
    HelloProtocol,
    StreamProtocol,
    UpdateMessageProtocol,
    UpdateProtocol,
    UpdateUserProtocol,
} from "../utils/protocol"
import { Secret } from "../utils/secret"

export interface User {
    id: string
    username: string
    icon: string
}

export interface Message {
    id: string
    authorId: string
    content: string
}

export const useChat = (clientId: string) => {
    const [users, setUsers] = useState<Record<string, User>>({})
    const [messages, setMessages] = useState<Message[]>([])

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
    }

    const hello = () => {
        const hello: HelloProtocol = {
            type: "Hello",
            data: {
                id: clientId,
            },
        }

        socketRef.current?.send(JSON.stringify(hello))
    }

    const getUsers = async () => {
        const get: GetUsersProtocol = {
            type: "Get",
            data: {
                id: clientId,
                target: "Users",
            },
        }

        socketRef.current?.send(JSON.stringify(get))
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
        socketRef.current?.send(JSON.stringify(payload))
    }

    const postMessage = async (username: string, message: string) => {}

    const updateMessages = (newMessages: Message[]) => {
        setMessages((msgs) => {
            return Array.from(new Set(newMessages.concat(msgs)))
        })
    }

    const updateUsers = (userList: User[]) => {
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
