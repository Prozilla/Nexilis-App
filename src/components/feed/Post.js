import { Component } from "react";
import Styles from "../../constants/Styles";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { decodeString, removeUrlQueries } from "../..";
import Colors from "../../constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default class Post extends Component {
	getMedia(post) {
		function generateImageComponent(image) {
			if (!image.url)
				return;

			const style = {};

			if (image.width && image.height)
				style.aspectRatio = image.width / image.height;

			const url = decodeString(image.url);
			console.log(url);
			return (<Image 
				nativeID="post-media"
				style={[styles.image, style]}
				source={{ uri: url }}/>
			);
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

		console.log(post);

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
			subredditIcon: <Image nativeID="post-subreddit-icon" style={[styles.image, { width: 20, height: 20, borderRadius: 10 }]} source={{ uri: post.subredditIcon }}/>,
			timestamp: <Text nativeID="post-timestamp" style={[Styles.text, { color: Colors.text.tertiary }]}>{post.relativeTime}</Text>,
			upvotes: generateCounterComponent("heart", "upvotes-counter", post.upvotesCount),
			comments: generateCounterComponent("comment", "comments-counter", post.commentsCount),
			// crossposts: generateCounterComponent("shuffle", "crossposts-counter", post.crosspostsCount),
		};

		const media = this.getMedia(post);
		if (media) {
			elements.media = (
				<View nativeID="post-media-container" style={[Styles.container, styles.image]}>
					{media}
				</View>
			);
		}

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
				{elements.media}
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
		resizeMode: "contain"
	},
	post: {
		alignItems: "flex-start",
		gap: 10,
		padding: 10,
		maxHeight: Dimensions.get("window").height * 0.8
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
	postBody: {
		maxHeight: 100,
		maxWidth: "100%",
		flexWrap: "wrap",
		overflow: "hidden",
		alignItems: "flex-start",
		justifyContent: "flex-start",
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