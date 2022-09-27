import { Box, Button, Container, Flex, SkeletonCircle, Text } from "@chakra-ui/react"
import type { GetServerSidePropsContext } from "next"
import { useEffect, useRef, useState } from "react"
import TextBox from "../components/textBox"
import { useChat } from "../hooks/chat"
import { Secret } from "../utils/secret"
import SkeltonMessages from "../components/skeltonMessages"
import MessageList from "../components/messageList"
import { useInView } from "react-intersection-observer"

interface Props {
    id: string
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    console.log("Cookie: ", ctx.req.headers.cookie)

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
    const { users, messages, isConnected, connect, getMessages, getUsers, postMessage } = useChat(id)
    const { ref: bottomRef, inView: isBottomInView, entry } = useInView()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [beforeFirstLoad, setBeforeFirstLoad] = useState(true)

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
        if (isBottomInView || beforeFirstLoad) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
            setBeforeFirstLoad(false)
        }
    }

    const onSkeltonEnter = () => {
        if (beforeFirstLoad) {
            return
        }

        // 古いメッセージを読み込む
        const oldestMessage = messages[messages.length - 1]
        if (oldestMessage) {
            getMessages(50, oldestMessage.id)
        }
    }

    return (
        <Container maxW={"container.xl"} h={"screen"}>
            <Box position={"sticky"} top={"4"} mb={"8"} zIndex={"10"}>
                <Flex ml={"auto"} justifyContent={"end"}>
                    {isConnected ? (
                        <Flex fontSize={"xs"} alignItems={"center"} gap={"2"}>
                            <Text>リアルタイム更新中</Text>
                            <Box w="3" h="3">
                                <SkeletonCircle startColor="green.100" endColor="green.300" w="full" h="full" />
                            </Box>
                        </Flex>
                    ) : (
                        <Flex direction={"column"}>
                            <Flex fontSize={"xs"} alignItems={"center"} gap={"2"}>
                                <Text>切断済み</Text>
                                <Box w="3" h="3" rounded={"full"} bg={"red.400"}></Box>
                            </Flex>
                            <Flex fontSize={"xs"} alignItems={"center"} gap={"2"}>
                                <Button
                                    variant={"ghost"}
                                    size={"xs"}
                                    onClick={() => {
                                        connect()
                                    }}
                                >
                                    再接続
                                </Button>
                            </Flex>
                        </Flex>
                    )}
                </Flex>
            </Box>
            <Box w={"full"} position={"relative"}>
                <Box>
                    <Flex flexDirection={"column-reverse"} px={4}>
                        <Box ref={scrollRef} />
                        <Box ref={bottomRef} />

                        <MessageList users={users} messages={messages} />

                        {/* スケルトン */}
                        {messages.length > 0 && <SkeltonMessages onEnter={onSkeltonEnter} />}
                    </Flex>
                </Box>
            </Box>
            <Box mt={"auto"} h={"36"} w={"full"} py={"2"} px={"4"} position={"sticky"} bottom={"0"} bg={"gray.800"}>
                <TextBox onSubmit={postMessage} />
            </Box>
        </Container>
    )
}

export default Page
