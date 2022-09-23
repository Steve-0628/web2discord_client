import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react"
import type { GetServerSidePropsContext, NextPage } from "next"
import { useEffect, useRef, useState } from "react"
import { useChat } from "../hooks/chat"
import { Secret } from "../utils/secret"

interface Props {
    id: string
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const res = await fetch(`${Secret.AUTH_SERVER}/auth`, {
        method: "POST",
        headers: {
            Cookie: ctx.req.headers.cookie ?? "",
        },
    })

    const json = await res.json()

    if (!json.id) {
        return {
            props: {},
            redirect: {
                destination: "/login",
                permanent: false,
            },
        }
    }

    return {
        props: {
            id: json.id,
        },
    }
}

const Page = ({ id }: Props) => {
    const { users, messages, isConnected, connect, getMessages, getUsers } = useChat(id)
    const messageBottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        connect()
    }, [])

    useEffect(() => {
        if (isConnected) {
            getMessages(50)
            getUsers()
        }
    }, [isConnected])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messageBottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div>
            <div>Connected: {isConnected ? "Yes" : "No"}</div>
            <Flex flexDirection={"column-reverse"} px={4}>
                <Box ref={messageBottomRef} />

                {messages.map((message) => {
                    const user = users[message.authorId]

                    if (user) {
                        return (
                            <Box w={"full"} mt={"4"} key={message.id}>
                                <Flex>
                                    <Box w={"8"} mr="4">
                                        <Avatar name={user.username} size="sm"></Avatar>
                                    </Box>
                                    <Box fontSize={"md"}>
                                        <Text fontWeight={"bold"}>{user.username}</Text>

                                        <Text>{message.content}</Text>
                                    </Box>
                                </Flex>
                            </Box>
                        )
                    } else {
                        return (
                            <Box w={"full"} key={message.id}>
                                <Flex>
                                    <Box w={"8"} mr="4"></Box>
                                    <Box>
                                        <Text>{message.content}</Text>
                                    </Box>
                                </Flex>
                            </Box>
                        )
                    }
                })}
            </Flex>
            {/* <div>{JSON.stringify(users)}</div> */}
            <div>
                {/* <Button
                    onClick={() => {
                        getMessages(50)
                    }}
                >
                    Load
                </Button> */}
            </div>
        </div>
    )
}

export default Page
