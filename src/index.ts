import express from "express"

const app = express()

app.get("/", (_req, res) => {
	res.send("Hello World!")
})

app.post("/create-user", (req, res) => {
	console.log(req.body)
	res.send("User created")
})

app.listen(3000, () => {
	console.log("Server running on port 3000")
})
