import { z } from "zod"
import express from "express"
import { PrismaClient } from "@prisma/client"
import { login } from "./user/login"
import { register } from "./user/register"
import middleware from "./middleware"
import { level } from "./level"
import { skin } from "./skins"
import { tempup } from "./tempup"
import { upgrade } from "./upgrades"
import { userData } from "./userData"

export const User = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	username: z.string(),
	coins: z.number().int().positive(),
	experience: z.number().int().positive()
})

export const prisma = new PrismaClient({
	errorFormat: "pretty"
})
export const app = express()

app.use(express.json())

app.post("/login", login)
app.post("/register", register)

app.get("/level", middleware, level)
app.post("/level", middleware, level)
app.put("/level", middleware, level)

app.get("/skin", middleware, skin)
app.put("/skin", middleware, skin)

app.get("/tempup", middleware, tempup)
app.put("/tempup", middleware, tempup)

app.get("/upgrade", middleware, upgrade)
app.patch("/upgrade", middleware, upgrade)

app.put("/userData", middleware, userData)

app.get("/welcome", (req, res) => {
	res.status(200).send({ message: "Welcome to the API!" })
})

app.post("/playerInfo", middleware, async (req: any, res) => {
	try {
		const user = await prisma.users.findUnique({
			where: { email: req.user.email },
			select: {
				id: true,
				username: true,
				email: true,
				coins: true,
				experience: true
			}
		})

		if (!user) return res.status(500).send({ error: "Internal server error" })

		res.status(200).send({
			user_id: user.id,
			username: user.username,
			email: user.email,
			coins: user.coins,
			experience: user.experience
		})
	} catch (error) {
		console.error(error)
		return res.status(500).send({ error: "Internal server error" })
	}
})

app.listen(4000, () => {
	console.log("Server running on port 4000")
})
