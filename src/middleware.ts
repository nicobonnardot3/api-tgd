import { NextFunction } from "express"
import jwt from "jsonwebtoken"

const verifyToken = (req: any, res, next: NextFunction) => {
	const token = req.body?.access_token
	if (!token) return res.status(403).send("A token is required")

	if (!process.env.TOKEN_KEY) throw new Error("TOKEN_KEY is not defined")
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_KEY)
		req.user = decoded
	} catch (err) {
		return res.status(401).send("Invalid Token")
	}
	return next()
}

export default verifyToken
