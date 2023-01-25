import { Box, Button, Container, Flex, SkeletonCircle, Text } from "@chakra-ui/react"
import type { GetServerSidePropsContext } from "next"
import { useEffect, useRef, useState } from "react"
import TextBox from "../components/textBox"
import { useChat } from "../hooks/chat"
import { Secret } from "../utils/secret"
import SkeltonMessages from "../components/skeltonMessages"
import MessageList from "../components/messageList"
import { useInView } from "react-intersection-observer"
import { userDB } from "../utils/db/user"

interface Props {
    id: string,
    username?: string,
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    console.log("Cookie: ", ctx.req.headers.cookie)
    const arr = ctx.req.headers.cookie?.match(/CF_Authorization=[^\. ]+\.(?<val>[^\.]+)\.[^\. ]+/)
    const decoded = JSON.parse(Buffer.from(arr!.groups!.val, "base64").toString())
    
    const alter_name = JSON.parse(Secret.ALTER_NAME)
    const username = alter_name[decoded.email]

    console.log(alter_name, username)


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
            username: username,
        },
    }
}

const Page = ({ id, username }: Props) => {
    const { users, messages, isConnected, connect, getMessages, getUsers, postMessage } = useChat(id)
    const { ref: bottomRef, inView: isBottomInView } = useInView()
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
        if (isBottomInView || beforeFirstLoad) {
            scrollToBottom()
            setBeforeFirstLoad(false)
        }
    }, [messages])

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
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
            <Box position={"fixed"} top={"4"} right={["4", "8"]} mb={"8"} zIndex={"10"}>
                <Box>
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
                </Box>
            </Box>

            <Box w={"full"} position={"relative"}>
                <Box>
                    <Flex flexDirection={"column-reverse"} px={4}>
                        <MessageList users={users} messages={messages} />

                        {/* スケルトン */}
                        {messages.length > 0 && <SkeltonMessages onEnter={onSkeltonEnter} />}
                    </Flex>
                </Box>
            </Box>

            <Box ref={bottomRef} />
            <Box ref={scrollRef} />

            <Box mt={"auto"} h={"36"} w={"full"} py={"2"} px={"4"} position={"sticky"} bottom={"0"} bg={"gray.800"}>
                {!isBottomInView && (
                    <Box position={"absolute"} top={"-36px"} right={"16px"}>
                        <Flex justifyContent={"end"}>
                            <Button
                                size={"sm"}
                                variant={"ghost"}
                                colorScheme={"cyan"}
                                onClick={() => {
                                    scrollToBottom()
                                }}
                            >
                                最新メッセージに戻る
                            </Button>
                        </Flex>
                    </Box>
                )}
                <TextBox onSubmit={postMessage} name={username} />
            </Box>
        </Container>
    )
}

export default Page
