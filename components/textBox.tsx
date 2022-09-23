import { Button, Flex, Input, Textarea } from "@chakra-ui/react"
import { useState } from "react"

interface Props {
    onSubmit: (username: string, message: string) => void
}

const TextBox = ({ onSubmit }: Props) => {
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = () => {
        onSubmit(username, message)
        setMessage("")
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                // postMessage()
                handleSubmit()
            }}
        >
            <Flex direction={"column"} w={"full"} gap={"1"}>
                <Flex gap={"1"}>
                    <Input
                        placeholder={"お名前"}
                        bg={"gray.800"}
                        _placeholder={{ color: "inherit" }}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                    />
                    <Button type={"submit"} colorScheme={"blue"} mx={"2"}>
                        送信
                    </Button>
                </Flex>
                <Textarea
                    placeholder={"メッセージを入力..."}
                    bg={"gray.700"}
                    _placeholder={{ color: "inherit" }}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                            // postMessage()
                            handleSubmit()
                        }
                    }}
                />
            </Flex>
        </form>
    )
}

export default TextBox
