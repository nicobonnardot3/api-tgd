import { prisma } from "./index"

export async function userData(req, res) {
	try {
		if (req.method === "PUT") {
			const { user_id } = req.user
			const { experience, coins } = req.body

			if (!experience && !coins) return res.status(400).json({ error: "Invalid body" })

			const data = experience ? { experience } : { coins }
			const select = experience ? { experience: true } : { coins: true }

			const newData = await prisma.users.update({
				where: {
					id: user_id
				},
				data: data,
				select: select
			})

			if (!newData) return res.status(500).json({ error: "Internal server error" })

			return res.json(newData)
		}

		return res.status(405).json({ error: "Method not allowed" })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error: "Internal server error" })
	}
}
