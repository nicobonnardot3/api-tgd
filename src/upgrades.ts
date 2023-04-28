import { prisma } from "./index"

export async function upgrade(req, res) {
	if (req.method === "GET") {
		const upgrades = await prisma.upgrades.findUnique({
			where: { user_id: req.user.user_id },
			select: {
				damage: true,
				attack_speed: true,
				turret_cost: true
			}
		})
		return res.json(upgrades)
	}

	if (req.method === "PATCH") {
		const { user_id } = req.user
		const { damage, attack_speed, turret_cost } = req.body

		const data = damage ? { damage } : attack_speed ? { attack_speed } : turret_cost ? { turret_cost } : null

		const upgrade = await prisma.upgrades.update({
			where: { user_id },
			data: { ...data },
			select: {
				damage: true,
				attack_speed: true,
				turret_cost: true
			}
		})

		if (!upgrade) return res.status(500).json({ error: "Internal server error" })

		return res.json(upgrade)
	}
}
