// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

import { Secret } from "../../utils/secret"

type Data = {
    name: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if (req.method !== "POST") {
        res.status(405).json({ name: "Method Not Allowed" })
        return
    }

    const token = req.body.token

    const r = await fetch(`${Secret.AUTH_SERVER}/auth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: req.headers.cookie ?? "",
        },
        body: JSON.stringify({ token }),
    })

    if (r.status === 200) {
        const json = await r.json()
        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; SameSite=None; Secure`)

        res.status(200).json({ ...json })
        return
    }

    res.status(401).json({ name: "Unauthorized" })
}

export default handler
