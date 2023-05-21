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