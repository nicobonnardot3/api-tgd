import { prisma } from "./index"

export async function tempup(req, res) {
	try {
		if (req.method === "GET") {
			const tempUps = await prisma.tempUp.findMany({
				where: { user_id: req.user.user_id },
				select: {
					temp_upgrade_id: true,
					amount: true
				}
			})

			return res.json(tempUps)
		}

		if (req.method === "PUT") {
			const { user_id } = req.user
			const { temp_upgrade_id, amount } = req.body

			if (!temp_upgrade_id || !amount) return res.status(400).json({ error: "Invalid body" })

			const tempUp = await prisma.tempUp.update({
				where: {
					user_id_temp_upgrade_id: {
						user_id,
						temp_upgrade_id
					}
				},
				data: { amount },
				select: {
					temp_upgrade_id: true,
					amount: true
				}
			})

			if (!tempUp) return res.status(500).json({ error: "Internal server error" })

			return res.json(tempUp)
		}

		return res.status(405).json({ error: "Method not allowed" })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error: "Internal server error" })
	}
}
