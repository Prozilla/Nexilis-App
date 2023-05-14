/**
 * Uses the Reddit API to fetch data from reddit.com
 * Documentation: https://www.reddit.com/dev/api/
 * 
 * Made by Prozilla
 */

const FILTERS = [
	"best",
	"hot",
	"new",
	"top",
	"rising",
	"controversial",
];

const DEFAULTS = {
	subreddits: ["itookapicture"],
	filter: FILTERS[1]
};

const POSTS_PER_FETCH = 4; // Should be 10
const FALLBACK_SUBREDDIT_ICON = "https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png";

class Feed {
	constructor(subreddits = DEFAULTS.subreddits, filter = DEFAULTS.filter) {
		this.subreddits = subreddits;
		this.filter = filter;
		this.lastPostId = null;
	}

	setSubreddits(subreddits) {
		this.subreddits = subreddits;
	}

	addSubreddit(subreddit) {
		this.subreddits.push(subreddit);
	}

	setFilter(filter) {
		this.filter = filter;
	}
}

const currentFeed = new Feed();

export async function refreshFeed() {
	currentFeed.lastPostId = null;
	return await fetchPosts().catch((error) => {
		console.error(error);
	});
}

export async function fetchPosts() {
	const { subreddits, filter } = currentFeed;
	let url = `https://www.reddit.com/r/${subreddits.join("+")}/${filter}.json?limit=${POSTS_PER_FETCH}`;

	if (currentFeed.lastPostId)
		url += `&after=t3_${currentFeed.lastPostId}`;

	let posts = await fetch(url).then((result) => {
		return result.json();
	}).then((result) => {
		return result.data.children.map((post) => post.data);
	}).catch((error) => {
		console.error(error);
	});

	posts = await Promise.all(posts.map(async (post) => {
		currentFeed.lastPostId = post.id;

		return {
			title: post.title,
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
	})).catch((error) => {
		console.error(error);
	});

	return posts;
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
				source = newSource;

			return;
		}).catch((error) => {
			console.error(error);
		});
	}

	return source;
}