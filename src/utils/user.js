import fetchProxied from "./proxy";
import { getData, storeData } from "./storage";

export default class User {
	#accessToken = null;
	#refreshToken = null;
	identity = null;

	constructor() {
		this.loadTokens().then(() => {
			this.updateIdentity();
		});
	}

	setAccessToken(accessToken) {
		if (accessToken == this.#accessToken)
			return;

		this.#accessToken = accessToken;
		this.saveTokens();

		this.updateIdentity();
	}

	setRefreshToken(refreshToken) {
		this.#refreshToken = refreshToken;
		this.saveTokens();
	}

	saveTokens() {
		if (this.#accessToken)
			storeData("access-token", this.#accessToken);

		if (this.#refreshToken)
			storeData("refresh-token", this.#refreshToken);
	}

	async loadTokens() {
		this.#accessToken = await getData("access-token");
		this.#refreshToken = await getData("refresh-token");
	}

	async fetchIdentity() {
		if (!this.#accessToken)
			return null;

		const url = `https://oauth.reddit.com/api/v1/me`;
		return await fetchProxied(url, {
			headers: {
				"Authorization": `bearer ${this.#accessToken}`
			}
		}).then((response) => response.json());
	}

	async updateIdentity() {
		this.identity = await this.fetchIdentity();
		console.log(this.identity);
	}

	getIdentity() {
		return this.identity;
	}
}