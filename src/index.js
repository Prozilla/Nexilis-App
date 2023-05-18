/**
 * Uses the Reddit API to fetch data from reddit.com
 * Documentation: https://www.reddit.com/dev/api/
 * 
 * Made by Prozilla
 */

import fetchProxied from "./utils/proxy";
import { getData, storeData } from "./utils/storage";

const SORT_TYPES = [
	"best",
	"hot",
	"new",
	"top",
	"rising",
	"controversial",
];

const DEFAULTS = {
	subreddits: ["itookapicture"],
	sort: SORT_TYPES[1],
	allowNsfw: true
};

const POSTS_PER_FETCH = 4; // Should be 10
const FALLBACK_SUBREDDIT_ICON = "https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png";

class Feed {
	constructor(subreddits = DEFAULTS.subreddits, sort = DEFAULTS.sort, allowNsfw = DEFAULTS.allowNsfw) {
		this.subreddits = subreddits;
		this.sort = sort;
		this.allowNsfw = allowNsfw;

		this.lastPostId = null;
	}

	setSubreddits(subreddits) {
		this.subreddits = subreddits;
	}

	addSubreddit(subreddit) {
		this.subreddits.push(subreddit);
	}

	setSort(sort) {
		this.sort = sort;
	}
}


class User {
	#accessToken = null;
	#refreshToken = null;

	constructor() {
		this.loadData();
	}

	setAccessToken(accessToken) {
		this.#accessToken = accessToken;
		this.saveData();
	}

	setRefreshToken(refreshToken) {
		this.#refreshToken = refreshToken;
		this.saveData();
	}

	saveData() {
		if (this.#accessToken)
			storeData("access-token", this.#accessToken);

		if (this.#refreshToken)
			storeData("refresh-token", this.#refreshToken);
	}

	async loadData() {
		this.#accessToken = await getData("access-token");
		this.#refreshToken = await getData("refresh-token");
		this.fetchIdentity().then(console.log);
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
}

export const feed = new Feed();
export const user = new User();

export async function refreshFeed() {
	feed.lastPostId = null;
	return await fetchPosts().catch((error) => {
		console.error(error);
	});
}

export async function fetchPosts() {
	const { subreddits, sort, allowNsfw } = feed;
	let url = `https://www.reddit.com/r/${subreddits.join("+")}/${sort}.json?limit=${POSTS_PER_FETCH}`;

	if (feed.lastPostId)
		url += `&after=t3_${feed.lastPostId}`;

	let posts = await fetch(url).then((result) => {
		return result.json();
	}).then((result) => {
		return result.data.children.map((post) => post.data);
	}).catch((error) => {
		console.error(error);
	});

	posts = await Promise.all(posts.map(async (post) => {
		feed.lastPostId = post.id;

		// Extract data from post
		return {
			title: post.title,
			id: post.id,
			body: post.selftext_html,
			subreddit: post.subreddit,
			upvotesCount: formatNumber(post.score),
			commentsCount: formatNumber(post.num_comments),
			crosspostsCount: formatNumber(post.num_crossposts),
			nsfw: post.over_18,
			subredditIcon: await fetchSubredditIcon(post.subreddit),
			relativeTime: formatRelativeTime(post.created),
			media: post.media,
			preview: post.preview
		}
	}).filter((post) => {
		// Filter NSFW posts
		return allowNsfw || !post.nsfw;
	})).catch((error) => {
		console.error(error);
	});

	// posts.forEach(console.log);

	return posts;
}

export async function fetchComments(postId) {
	const url = `https://www.reddit.com/comments/${postId}/.json`;

	const comments = await fetch(url).then((result) => {
		return result.json();
	}).catch((error) => {
		console.error(error);
	});

	// console.log(comments);

	return comments;
}

export function decodeString(string) {
	return string.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

export function removeUrlQueries(url) {
	return url.split("?")[0];
}

function formatNumber(value) {
	if (value > 999999) {
		return Math.sign(value) * ((Math.abs(value) / 1000000).toFixed(1)) + "m";
	} else if (value > 999) {
		return Math.sign(value) * ((Math.abs(value) / 1000).toFixed(1)) + "k";
	} else {
		return value;
	}
}

function formatRelativeTime(unixDate) {
	const date = Math.abs((new Date(unixDate * 1000).getTime() / 1000).toFixed(0));
	const currentDate = Math.abs((new Date().getTime() / 1000).toFixed(0));

	const timePassed = currentDate - date;

	const years = Math.floor(timePassed / 30758400);
	const days = Math.floor(timePassed / 86400);
	const hours = Math.floor(timePassed / 3600) % 24;
	const minutes = Math.floor(timePassed / 60) % 60;
	const seconds = timePassed % 60;

	let time;
	if (years > 0) {
		time = years > 1 ? years + " years" : years + " year";
	} else if (days > 0) {
		time = days > 1 ? days + " days" : days + " day";
	} else if (hours > 0) {
		time = hours > 1 ? hours + " hours" : hours + " hour";
	} else if (minutes > 0) {
		time = minutes > 1 ? minutes + " minutes" : minutes + " minute";
	} else {
		time = seconds > 1 ? seconds + " seconds" : seconds + " second";
	}

	return time + " ago";
}

async function fetchSubredditIcon(subreddit) {
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