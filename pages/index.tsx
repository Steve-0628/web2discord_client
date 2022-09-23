import {
    Avatar,
    Box,
    Button,
    Circle,
    Container,
    Flex,
    Skeleton,
    SkeletonCircle,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react"
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
        <Container maxW={"container.xl"} h={"screen"}>
            <Box position={"sticky"} top={"4"}>
                <Flex ml={"auto"} justifyContent={"end"}>
                    {isConnected ? (
                        <Flex fontSize={"xs"} alignItems={"center"} gap={"2"}>
                            <Text>リアルタイム更新中</Text>
                            <Box w="3" h="3">
                                <SkeletonCircle startColor="green.100" endColor="green.300" w="full" h="full" />
                            </Box>
                        </Flex>
                    ) : (
                        <Flex fontSize={"xs"} alignItems={"center"} gap={"2"}>
                            <Text>切断済み</Text>
                            <Box w="3" h="3">
                                <Circle bg={"red"} />
                            </Box>
                        </Flex>
                    )}
                </Flex>
            </Box>
            <Box w={"full"} position={"relative"}>
                <Box>
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
                </Box>
            </Box>
            <Box mt={"auto"} h={"24"} w={"full"} py={"2"} px={"4"} position={"sticky"} bottom={"0"}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                    }}
                >
                    <Flex>
                        <Textarea
                            placeholder={"メッセージを入力..."}
                            w={"full"}
                            bg={"gray.700"}
                            _placeholder={{ color: "inherit" }}
                        />
                        <Button type={"submit"} colorScheme={"blue"} mx={"2"}>
                            送信
                        </Button>
                    </Flex>
                </form>
            </Box>
        </Container>
    )
}

export default Page
