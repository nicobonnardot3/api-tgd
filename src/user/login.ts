import { createHash } from "crypto"
import { User, prisma } from "../index"
import jwt from "jsonwebtoken"

export async function login(req, res) {
	if (!process.env.TOKEN_KEY) throw new Error("TOKEN_KEY is not defined")
	if (!req.body) return res.status(400).json({ error: "No body provided" })
	try {
		if (User.pick({ email: true, password: true }).safeParse(req.body).success === false) return res.status(400).json({ error: "Invalid body" })

		const user = User.pick({ email: true, password: true }).parse(req.body)

		const dbUser = await prisma.users.findUnique({
			where: { email: user.email }
		})
		if (!dbUser) return res.status(400).json({ error: "User does not exist" })

		const passhash = createHash("sha256").update(user.password).digest("hex")

		if (dbUser.password !== passhash) return res.status(400).json({ error: "Invalid password" })

		const expireDate = new Date(new Date().valueOf() + 30 * 24 * 60 * 60 * 1000)

		const result =
			(await prisma.$queryRaw`INSERT INTO sessions (session_id, user_id, expiration_date) VALUES (UUID(), ${dbUser.id}, ${expireDate}) RETURNING session_id`) as {
				session_id: string
			}

		const token = jwt.sign(
			{
				user_id: dbUser.id,
				username: dbUser.username,
				email: dbUser.email,
				session_id: result.session_id
			},
			process.env.TOKEN_KEY
		)

		const { password, ...userWithoutPassword } = dbUser

		res.send({ token, ...userWithoutPassword })
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: "Internal server error" })
	}
}
