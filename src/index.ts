import { z } from "zod"
import express from "express"
import { PrismaClient } from "@prisma/client"
import { login } from "./user/login"
import { createUser } from "./user/createUser"

export const User = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	username: z.string(),
	coins: z.number().int().positive(),
	experience: z.number().int().positive()
})

export const prisma = new PrismaClient()
export const app = express()

app.use(express.json())

app.post("/login", login)
app.post("/register", createUser)

app.listen(3000, () => {
	console.log("Server running on port 3000")
})
