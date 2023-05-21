import fetchProxied from "../utils/proxy";
import { getData, storeData } from "../native/storage";

export default class User {
	#accessToken = null;
	#refreshToken = null;
	identity = null;

	constructor() {
		this.loadTokens().then(() => {
			this.updateIdentity();
		});
	}

	// TO DO: convert to set function
	async setAccessToken(accessToken) {
		if (accessToken == this.#accessToken)
			return;

		this.#accessToken = accessToken;
		this.storeAccessToken();

		await this.updateIdentity();
	}

	get accessToken() {
		return this.#accessToken;
	}

	storeAccessToken() {
		storeData("access-token", this.#accessToken);
	}

	setRefreshToken(refreshToken) {
		this.#refreshToken = refreshToken;
		this.storeRefreshToken();
	}

	storeRefreshToken() {
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
		// console.log("Updated user identity");
		return this.identity;
	}

	getIdentity() {
		return this.identity;
	}
}