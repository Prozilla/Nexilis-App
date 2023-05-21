import { removeUrlQueries } from "../../utils/utils";

const FALLBACK_SUBREDDIT_ICON = "https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png";

export async function fetchSubredditIcon(subreddit) {
	let source = FALLBACK_SUBREDDIT_ICON;

	if (subreddit != "all") {
		await fetch(`https://www.reddit.com/r/${subreddit}/about.json`).then((result) => {
			return result.json();
		}).then((result) => {
			const newSource = result.data.icon_img ? result.data.icon_img : result.data.community_icon;

			if (newSource)
				source = removeUrlQueries(newSource);

			return;
		}).catch((error) => {
			console.error(error);
		});
	}

	return source;
}