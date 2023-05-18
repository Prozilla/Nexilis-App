import express from "express";
import cors from "cors";
import fetch, { FormData } from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const port = process.env.PORT || 3000;

app.get("/", (request, response) => {
	response.status(200).send("Hello world!");
});

app.post("/api/fetch", async (request, response) => {
	const { url, method, body, headers, type } = request.body;

	if (url) {
		const options = {
			headers: {}
		};

		if (method)
			options.method = method;

		if (headers) {
			for (const [key, value] of Object.entries(headers)) {
				options.headers[key] = value;
			}
		}

		if (body) {
			switch (type) {
				case "form":
					options.headers["Content-Type"] = "application/x-www-form-urlencoded";
					const form = new FormData();
					for (const [key, value] of Object.entries(body)) {
						form.set(key, value);
					}
					options.body = new URLSearchParams(form).toString();
					break;
				default:
					options.headers["Content-Type"] = "application/json";
					options.body = JSON.stringify(body);
					break;
			}
		}

		await fetch(url, options).then((result) => result.json()).then((result) => {
			console.log(url, options, result);
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