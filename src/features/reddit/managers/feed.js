import { extractPostData } from "../types/posts";

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

export default class FeedManager {
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
			return await extractPostData(post);
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