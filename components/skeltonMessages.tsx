import { Avatar, Box, Flex, SkeletonCircle, SkeletonText, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"

type WidthType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full"

const SkeltonMMessage = () => {
    const [randomTextLines, setRandomTextLines] = useState(0)
    const [randomTextWidth, setRandomTextWidth] = useState<WidthType>("sm")

    useEffect(() => {
        setRandomTextLines(Math.floor(Math.random() * 3) + 1)
        const width: WidthType[] = ["xs", "sm", "md", "lg", "xl"]
        setRandomTextWidth(width[Math.floor(Math.random() * width.length)])
    }, [])

    return (
        <Box w={"full"} my={"4"}>
            <Flex>
                <Box w={"8"} mr="4">
                    <SkeletonCircle />
                </Box>
                <Flex direction={"column"} w={randomTextWidth}>
                    <Box fontSize={"md"}>
                        <SkeletonText noOfLines={1} />

                        <SkeletonText noOfLines={randomTextLines} mt={"4"} spacing={"4"} />
                    </Box>
                </Flex>
            </Flex>
        </Box>
    )
}

const SkeltonMessages = () => {
    const count = 10

    return (
        <div>
            {[...Array(count)].map((_, i) => (
                <SkeltonMMessage key={i} />
            ))}
        </div>
    )
}

export default SkeltonMessages
