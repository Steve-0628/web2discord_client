import type { GetServerSidePropsContext, NextPage } from "next"
import { useEffect, useRef, useState } from "react"
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
    const [message, setMessage] = useState("Hello World")

    const socketRef = useRef<WebSocket>()
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        socketRef.current = new WebSocket(Secret.NEXT_PUBLIC_STREAM_SERVER)
        console.log(socketRef)
        socketRef.current.onopen = function () {
            setIsConnected(true)
            console.log("Connected")
        }

        socketRef.current.onclose = function () {
            console.log("closed")
            setIsConnected(false)
        }
    }, [])

    return (
        <div>
            <div>Connected: {isConnected ? "Yes" : "No"}</div>
            <div>{message}</div>
        </div>
    )
}

export default Page
