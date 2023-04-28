import { prisma } from "./index"

export async function level(req, res) {
	try {
		if (req.method === "GET") {
			const levels = await prisma.levels.findMany({
				where: { user_id: req.user.user_id },
				select: {
					difficulty: true,
					level_id: true
				}
			})
			return res.json(levels)
		}

		if (req.method === "PUT") {
			const { user_id } = req.user
			const { level_id, difficulty } = req.body

			if (!level_id || !difficulty) return res.status(400).json({ error: "Invalid body" })

			const level = await prisma.levels.update({
				where: {
					user_id_level_id: {
						user_id,
						level_id
					}
				},
				data: { difficulty },
				select: {
					difficulty: true,
					level_id: true
				}
			})

			if (!level) return res.status(500).json({ error: "Internal server error" })
			return res.json(level)
		}

		if (req.method === "POST") {
			const { user_id } = req.user
			const { levels } = req.body

			if (!levels) return res.status(400).json({ error: "Invalid body" })

			const newLevels = levels.map(
				async level =>
					await prisma.levels.update({
						where: {
							user_id_level_id: {
								user_id,
								level_id: level.level_id
							}
						},
						data: { difficulty: level.difficulty },
						select: {
							difficulty: true,
							level_id: true
						}
					})
			)

			if (!newLevels) return res.status(500).json({ error: "Internal server error" })

			return res.json(newLevels)
		}

		return res.status(405).json({ error: "Method not allowed" })
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error: "Internal server error" })
	}
}
