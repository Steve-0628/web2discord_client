import { Button, Container, VStack, Text, Input, FormLabel, Box } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useClient } from "../hooks/client"

const Page = () => {
    const { status, login } = useClient()
    const [password, setPassword] = useState("")
    const router = useRouter()

    useEffect(() => {
        if (status === "success") {
            router.push("/")
        }
    }, [status])

    return (
        <Container maxW={"container.sm"}>
            <VStack m={8}>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    Login
                </Text>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        login(password)
                    }}
                >
                    <Box py={2}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type={"password"}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                    </Box>
                    <Box py={2}>
                        {status === "idle" && <Button type="submit">Login</Button>}

                        {status === "pending" && <Box>Pending...</Box>}
                        {status === "success" && <Box>Success!</Box>}
                        {status === "error" && <Box>Something went wrong</Box>}
                    </Box>
                </form>
            </VStack>
        </Container>
    )
}

export default Page
