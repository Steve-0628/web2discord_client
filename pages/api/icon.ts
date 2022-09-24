import { toPng } from "jdenticon"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.status(405).json({ name: "Method Not Allowed" })
        return
    }

    const username = req.query.username as string

    res.setHeader("Content-Type", "image/png")

    res.status(200).send(toPng(username, 128))
}

export default handler
