import { formatNumber, formatRelativeTime, removeUrlQueries } from "./utils";

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

export class Feed {
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

	async fetchPosts() {
		const { subreddits, sort, allowNsfw } = this;
		let url = `https://www.reddit.com/r/${subreddits.join("+")}/${sort}.json?limit=${POSTS_PER_FETCH}`;
	
		if (this.lastPostId)
			url += `&after=t3_${this.lastPostId}`;
	
		let posts = await fetch(url).then((result) => {
			return result.json();
		}).then((result) => {
			return result.data.children.map((post) => post.data);
		}).catch((error) => {
			console.error(error);
		});
	
		posts = await Promise.all(posts.map(async (post) => {
			this.lastPostId = post.id;
	
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

	async refreshFeed() {
		this.lastPostId = null;
		return await this.fetchPosts().catch((error) => {
			console.error(error);
		});
	}
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