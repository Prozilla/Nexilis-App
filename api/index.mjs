import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (request, response) => {
	response.status(200).send("Hello world!");
});

app.post("/api/fetch", async (request, response) => {
	const { url, method, body, headers } = request.body;

	if (url) {
		const options = {
			headers: {}
		};

		if (method)
			options.method = method;

		if (body) {
			options.headers["Content-Type"] = "application/json";
			options.body = JSON.stringify(body);
		}

		if (headers) {
			for (const [key, value] of Object.entries(headers)) {
				options.headers[key] = value;
			}
		}

		await fetch(url, options).then((result) => result.json()).then((result) => {
			response.status(200).json(result);
		}).catch(console.error);
	} else {
		response.status(400 ).send("Invalid request - A url is required");
	}
});

app.listen(port, (error, response) => {
	if (error) {
		console.log(error);
		return response.status(500).send(error.message);
	} else {
		console.log(`[INFO] Listening on port ${port}`);
	}
});