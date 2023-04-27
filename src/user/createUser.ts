import { createHash, randomUUID } from "crypto"
import { prisma, User } from "../index"
import jwt from "jsonwebtoken"

export const createUser = async (req, res) => {
	if (!process.env.TOKEN_KEY) throw new Error("TOKEN_KEY is not defined")
	try {
		if (!req.body) return res.status(400).send({ error: "No body provided" })

		if (User.pick({ username: true, email: true, password: true }).safeParse(req.body).success === false)
			return res.status(400).send({ error: "Invalid body" })

		const user = User.pick({ username: true, email: true, password: true }).parse(req.body)

		const passhash = createHash("sha256").update(user.password).digest("hex")

		const userExists = await prisma.users.findUnique({
			where: { email: user.email }
		})
		if (userExists) return res.status(400).send({ error: "User already exists" })

		await prisma.$executeRaw`CALL create_user(${user.username}, ${user.email.toLowerCase()}, ${passhash})`
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
		if (!dbUser) return res.status(500).send({ error: "Internal server error" })

		const session_id = await prisma.sessions.create({
			data: {
				user_id: dbUser.id,
				expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				session_id: randomUUID()
			},
			select: {
				session_id: true
			}
		})

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
		return res.status(500).send({ error: "Internal server error" })
	}
}
