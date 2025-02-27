import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { MessageProtocol, UserProtocol } from "../utils/protocol"

interface Props {
    username: string
    message: MessageProtocol
}

const MessageBox = ({ username, message }: Props) => {
    return (
        <Box w={"full"} my={"2"}>
            <Flex>
                <Box w={"8"} mr="4">
                    <Avatar name={username} src={`/api/icon?username=${username}`} size="sm"></Avatar>
                </Box>
                <Flex direction={"column"}>
                    <Box fontSize={"md"}>
                        <Text fontWeight={"bold"}>{username}</Text>

                        <Text wordBreak={"break-word"} whiteSpace={"pre"}>
                            {message.content}
                        </Text>
                    </Box>
                    {message.attachments.length > 0 && (
                        <Box>
                            <Flex>
                                {message.attachments.map((attachment) => {
                                    switch (attachment.type) {
                                        case "Image": {
                                            return <Image maxH={"72"} key={attachment.id} src={attachment.url} />
                                        }
                                        case "Video": {
                                            return (
                                                <a href={attachment.url} target={"__blank"} key={attachment.id}>
                                                    <Flex direction={"column"} h={"32"} w={"40"} opacity={0.75}>
                                                        <Flex
                                                            m="auto"
                                                            fontSize={"lg"}
                                                            fontWeight="bold"
                                                            placeItems={"center"}
                                                        >
                                                            <Text>動画</Text>
                                                            <ExternalLinkIcon ml="2" />
                                                        </Flex>
                                                    </Flex>
                                                </a>
                                            )
                                        }
                                        default: {
                                            return <Box></Box>
                                        }
                                    }
                                })}
                            </Flex>
                        </Box>
                    )}
                </Flex>
            </Flex>
        </Box>
    )
}

export default MessageBox
