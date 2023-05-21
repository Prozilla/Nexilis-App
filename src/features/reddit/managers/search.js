const ITEMS_PER_FETCH = 5;

export default class SearchManager {
	async any(query) {
		let url = `https://www.reddit.com/search/.json?q=${query}&limit=${ITEMS_PER_FETCH}&sort=relevance`;
		
		let items = await fetch(url).then((result) => {
			return result.json();
		}).then((result) => {
			return result.data.children.map((item) => item.data);
		}).catch((error) => {
			console.error(error);
		});

		console.log(items);
	}
}