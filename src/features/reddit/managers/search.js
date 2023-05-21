import { feed } from "..";

const ITEMS_PER_FETCH = 5;

const TYPES = {
	POST: "link",
	SUBREDDIT: "sr",
	USER: "user",
}

export default class SearchManager {
	async query(query, type) {
		if (!query || query == "")
			return null;

		let url = `https://www.reddit.com/search/.json?q=${query}&limit=${ITEMS_PER_FETCH}&sort=relevance`;

		if (type && Object.values(TYPES).includes(type))
			url += `&type=${type}`;

		if (feed.allowNsfw)
			url += `&include_over_18=1`;
		
		let items = await fetch(url).then((result) => {
			return result.json();
		}).then((result) => {
			return result?.data?.children?.map((item) => item.data);
		}).catch((error) => {
			console.error(error);
		});

		console.log(items);

		return items;
	}

	post = async (query) => await this.query(query, TYPES.POST);
	subreddit = async (query) => await this.query(query, TYPES.SUBREDDIT);
	user = async (query) => await this.query(query, TYPES.USER);
}