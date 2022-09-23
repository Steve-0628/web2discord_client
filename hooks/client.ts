import { useState } from "react"
import { setCookie } from "cookies-next"

type LoginStatus = "idle" | "pending" | "success" | "error"

export const useClient = () => {
    const [status, setStatus] = useState<LoginStatus>("idle")

    const login = async (token: string) => {
        setStatus("pending")

        const res = await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({ token }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (res.ok) {
            setStatus("success")
            const json = await res.json()
            const id = json.id
            setCookie("client_id", id)
        } else {
            setStatus("error")
        }
    }

    return {
        status,
        login,
    }
}
