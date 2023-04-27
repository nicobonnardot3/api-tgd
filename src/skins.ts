import { prisma } from "./index"

export async function skin(req, res) {
	try {
		if (req.method === "GET") {
			const skins = await prisma.skins.findMany({
				where: { user_id: req.user.user_id },
				select: {
					skin_type: true,
					type: true
				}
			})
			return res.json(skins)
		}
		if (req.method === "PUT") {
			const { user_id } = req.user
			const { skin_type, type } = req.body

			if (!skin_type || !type) return res.status(400).json({ error: "Invalid body" })

			const skin = await prisma.skins.update({
				where: {
					user_id_skin_type: {
						user_id,
						skin_type
					}
				},
				data: { type },
				select: {
					skin_type: true,
					type: true
				}
			})

			if (!skin) return res.status(500).json({ error: "Internal server error" })

			return res.json(skin)
		}

		return res.status(405).json({ error: "Method not allowed" })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error: "Internal server error" })
	}
}
