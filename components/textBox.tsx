import { Button, Flex, Input, Textarea } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { userDB } from "../utils/db/user"

interface Props {
    onSubmit: (username: string, message: string) => void
}

const TextBox = ({ onSubmit }: Props) => {
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")

    const submitButtonRef = useRef<HTMLButtonElement>(null)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)
    const usernameInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = () => {
        if (username === "" || message === "") {
            return
        }
        onSubmit(username, message)
        saveUsername(username)
        setMessage("")
        if (messageInputRef.current) {
            messageInputRef.current.value = ""
        }
    }

    const getUserData = async () => {
        const userData = await userDB.get()
        return userData
    }

    const saveUsername = (username: string) => {
        // 名前を保存
        userDB.set({ name: username })
    }

    const updateUsernameInput = async () => {
        const userData = await getUserData()
        if (userData) {
            setUsername(userData.name)
            if (usernameInputRef.current) {
                usernameInputRef.current.value = userData.name
            }
        }
    }

    useEffect(() => {
        updateUsernameInput()
    }, [usernameInputRef.current])

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}
        >
            <Flex direction={"column"} w={"full"} gap={"1"}>
                <Flex gap={"1"}>
                    <Input
                        ref={usernameInputRef}
                        placeholder={"お名前"}
                        bg={"gray.800"}
                        _placeholder={{ color: "inherit" }}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                    />
                    <Button ref={submitButtonRef} type={"submit"} colorScheme={"blue"} mx={"2"}>
                        送信
                    </Button>
                </Flex>
                <Textarea
                    ref={messageInputRef}
                    placeholder={"メッセージを入力..."}
                    bg={"gray.700"}
                    _placeholder={{ color: "inherit" }}
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if ((e.key === "Enter" && e.ctrlKey) || (e.key === "Enter" && e.metaKey)) {
                            submitButtonRef.current?.click()
                        }
                    }}
                />
            </Flex>
        </form>
    )
}

export default TextBox
