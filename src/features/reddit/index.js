import { FeedManager } from "./managers/feed";
import SearchManager from "./managers/search";
import UserManager from "./managers/user";

/**
 * Uses the Reddit API to fetch data from reddit.com
 * Documentation: https://www.reddit.com/dev/api/
 * 
 * Made by Prozilla
 */

export const feed = new FeedManager();
export const user = new UserManager();
export const search = new SearchManager();