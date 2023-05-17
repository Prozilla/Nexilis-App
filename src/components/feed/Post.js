import { Component, PureComponent } from "react";
import Styles from "../../constants/Styles";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { decodeString, removeUrlQueries } from "../..";
import Colors from "../../constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default class Post extends PureComponent {
	getMedia(post) {
		function generateImageComponent(image) {
			if (!image.url)
				return;

			const style = {};

			if (image.width && image.height)
				style.aspectRatio = image.width / image.height;

			let url = decodeString(image.url);

			return (<Image 
				nativeID="post-media"
				resizeMode="contain"
				style={[styles.image, styles.postMedia, style]}
				source={{ uri: url }}
				onError={({ nativeEvent: { error } }) => { console.error(error) }}
			/>);
		}

		if (post.media || (post.preview && post.preview.reddit_video_preview)) {
			let source;
			let isPreview = false;
	
			if (post.media && post.media.reddit_video) {
				source = post.media.reddit_video.fallback_url.substring(0, post.media.reddit_video.fallback_url.length - 16)
			} else if (post.preview && post.preview.reddit_video_preview) {
				source = post.preview.reddit_video_preview.fallback_url;
				isPreview = true;
			}
	
			if (source) {
				if (!isPreview) {
					// Video
	
					// Fetch audio
					const audioSource = source.replace(new RegExp("DASH_[0-9]+.mp4"), "DASH_audio.mp4");
					let audio = "";
	
					audio = `<audio preload="auto" controls loop>
						<source src=\"${audioSource}" type="audio/mp4">
					</audio>`;
	
					media = `<video class="${classes.length ? classes.join(" ") : classes[0]}" preload="auto" controls loop playsinline>
						<source src=\"${source}" type="video/mp4">
						${audio}
					</video>`;
				} else {
					// Video
					media = `<video class="${classes.length ? classes.join(" ") : classes[0]}" preload="auto" controls loop playsinline>
						<source src=\"${source}" type="video/mp4">
					</video>`;
				}
			} else if (post.media.oembed) {
				// Images
				const image = post.media.oembed;
				image.url = post.media.oembed.thumbnail_url;
				return generateImageComponent(image);
			}
		} else if (post.preview) {
			if (post.preview.images[0].variants.gif) {
				// Gifs
				return generateImageComponent(post.preview.images[0].variants.gif);
			} else {
				// Images
				return generateImageComponent(post.preview.images[0].source);
			}
		}
	}

	render() {
		const post = this.props.data;

		if (!post)
			return;

		function generateCounterComponent(iconName, label, value) {
			const color = Colors.text.tertiary;

			return (
				<View style={[styles.postCounter]}>
					<FontAwesomeIcon icon={iconName} color={color} size={16}/>
					<Text nativeID={label} style={[Styles.text, { color, fontSize: 12 }]}>{value}</Text>
				</View>
			)
		}

		const elements = {
			title: <Text nativeID="post-title" style={Styles.text}>{post.title}</Text>,
			subreddit: <Text nativeID="post-subreddit-name" style={[Styles.text, { color: Colors.text.secondary }]}>{post.subreddit}</Text>,
			subredditIcon: <Image nativeID="post-subreddit-icon" resizeMode="contain" style={[styles.image, styles.postSubredditIcon]} source={{ uri: post.subredditIcon }}/>,
			timestamp: <Text nativeID="post-timestamp" style={[Styles.text, { color: Colors.text.tertiary }]}>{post.relativeTime}</Text>,
			upvotes: generateCounterComponent("heart", "upvotes-counter", post.upvotesCount),
			comments: generateCounterComponent("comment", "comments-counter", post.commentsCount),
			// crossposts: generateCounterComponent("shuffle", "crossposts-counter", post.crosspostsCount),
			media: this.getMedia(post)
		};

		if (post.body) {
			const html = decodeString(post.body).replace(/<\!--.*?-->/g, "");

			elements.body = (<View style={[styles.postBody]}>
				<RenderHTML
					contentWidth={Dimensions.get("window").width}
					style={Styles.text}
					source={{ html }}
					tagsStyles={tagStyles}
				/>
			</View>);
		}

		return (
			<View nativeID="post-container" style={[Styles.container, styles.post]}>
				<View nativeID="post-header-container" style={[styles.postHeader]}>
					<View nativeID="post-subreddit-container" style={[styles.postSubreddit]}>
						{elements.subredditIcon}
						{elements.subreddit}
					</View>
					{elements.timestamp}
				</View>
				{elements.title}
				{elements.body}
				<View nativeID="post-media-container" style={[styles.image, styles.postMediaContainer]}>
					{elements.media}
				</View>
				<View nativeID="post-footer-container" style={styles.postFooter}>
					{elements.upvotes}
					{elements.comments}
					{elements.crossposts}
				</View>
			</View>
		);
	}
}

const tagStyles = {
	p: StyleSheet.flatten(StyleSheet.compose(Styles.text, {
		color: Colors.text.secondary
	})),
	body: {
		marginTop: -14,
		marginBottom: -14,
		maxWidth: "100%"
	}
}

const styles = StyleSheet.create({
	image: {
		width: "100%",
		maxHeight: "100%",
	},
	post: {
		alignItems: "flex-start",
		justifyContent: "flex-start",
		gap: 10,
		padding: 10,
		maxHeight: Dimensions.get("window").height * 0.8,
		overflow: "hidden"
	},
	postHeader: {
		alignItems: "center",
		justifyContent: "flex-start",
		flexDirection: "row",
		gap: 10
	},
	postSubreddit: {
		flexDirection: "row",
		gap: 5,
		alignItems: "center",
		justifyContent: "center",
	},
	postSubredditIcon: {
		width: 20,
		height: 20,
		borderRadius: 10
	},
	postBody: {
		maxHeight: 100,
		maxWidth: "100%",
		flexWrap: "wrap",
		overflow: "hidden",
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
	postMediaContainer: {
		flexShrink: 1,
		alignItems: "center",
		justifyContent: "center",
		resizeMode: "contain",
		objectFit: "contain"
	},
	postMedia: {
		maxWidth: "100%",
		maxHeight: "100%",
		resizeMode: "contain",
		objectFit: "contain",
		flexShrink: 1,
	},
	postFooter: {
		flexDirection: "row",
		gap: 15,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	postCounter: {
		flexShrink: 1,
		flexDirection: "row",
		gap: 5,
		color: Colors.text.primary,
		alignItems: "center",
		justifyContent: "center",
	}
});