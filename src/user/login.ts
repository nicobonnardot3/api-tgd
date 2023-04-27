import { User, prisma } from "../index"
import jwt from "jsonwebtoken"

export const login = async (req, res) => {
	if (!process.env.TOKEN_KEY) throw new Error("TOKEN_KEY is not defined")
	if (!req.body) return res.status(400).json({ error: "No body provided" })
	try {
		if (User.pick({ email: true, password: true }).safeParse(req.body).success === false) return res.status(400).json({ error: "Invalid body" })

		const user = User.pick({ email: true, password: true }).parse(req.body)

		const dbUser = await prisma.users.findUnique({
			where: { email: user.email },
			select: {
				id: true,
				username: true,
				email: true,
				coins: true,
				experience: true
			}
		})
		if (!dbUser) return res.status(400).json({ error: "User does not exist" })

		const session_id =
			(await prisma.$queryRaw`INSERT INTO tgd.sessions (session_id, user_id, expiration_date) VALUES (UUID(), dbUser.id, new Date() + 30 * 24 * 60 * 60 * 1000) RETURNING session_id`) as {
				session_id: string
			}

		const token = jwt.sign(
			{
				user_id: dbUser.id,
				username: dbUser.username,
				email: dbUser.email,
				session_id: session_id.session_id
			},
			process.env.TOKEN_KEY
		)

		res.send({ ...dbUser, token })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
