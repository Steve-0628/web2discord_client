import { toPng, JdenticonConfig } from "jdenticon"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.status(405).json({ name: "Method Not Allowed" })
        return
    }

    const username = req.query.username as string

    res.setHeader("Content-Type", "image/png")

    // Custom identicon style
    // https://jdenticon.com/icon-designer.html?config=2a194bff01413a132d57295f
    const config: JdenticonConfig = {
        lightness: {
            color: [0.46, 0.88],
            grayscale: [0.42, 0.95],
        },
        saturation: {
            color: 0.59,
            grayscale: 0.2,
        },
        backColor: "#191e4bff",
    }

    res.status(200).send(toPng(username, 128, config))
}

export default handler
