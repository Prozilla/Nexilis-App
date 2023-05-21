import { formatNumber, formatRelativeTime } from "../../utils/utils";
import { fetchSubredditIcon } from "./subreddits";

export async function extractPostData(post) {
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
	};
}