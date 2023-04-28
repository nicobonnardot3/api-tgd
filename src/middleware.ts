import { NextFunction } from "express"
import { prisma } from "./index"
import jwt, { JwtPayload } from "jsonwebtoken"
require("dotenv").config()

const verifyToken = async (req: any, res, next: NextFunction) => {
	const token = req.body?.access_token
	if (!token) return res.status(403).send({ error: "A token is required" })

	if (!process.env.TOKEN_KEY) throw new Error("TOKEN_KEY is not defined")
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_KEY) as JwtPayload

		const result = await prisma.sessions.findUnique({
			where: {
				user_id_session_id: {
					user_id: Number(decoded.user_id),
					session_id: decoded.session_id
				}
			},
			select: {
				expiration_date: true
			}
		})

		if (result?.expiration_date && result?.expiration_date < new Date()) return res.status(401).send("Token is expired")

		req.user = decoded
	} catch (err) {
		console.log(err)
		return res.status(401).send({ error: "Invalid Token" })
	}
	return next()
}

export default verifyToken
