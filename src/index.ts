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
app.put("/level", middleware, level)

app.get("/skin", middleware, skin)
app.put("/skin", middleware, skin)

app.get("/tempup", middleware, tempup)
app.put("/tempup", middleware, tempup)

app.get("/upgrade", middleware, upgrade)
app.patch("/upgrade", middleware, upgrade)

app.post("/welcome", middleware, (req: any, res) => {
	res.status(200).send({ message: `Welcome ${req.user.username}!` })
})

app.listen(4000, () => {
	console.log("Server running on port 4000")
})
