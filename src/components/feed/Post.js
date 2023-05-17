import { PureComponent } from "react";
import Styles from "../../constants/Styles";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { decodeString, fetchComments } from "../..";
import Colors from "../../constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Comment from "./Comment";
import { Audio, Video, ResizeMode } from "expo-av";

const DISPLAY_MDOE = {
	PREVIEW: 0,
	COMMENTS: 1,
	MEDIA: 2
};

export default class Post extends PureComponent {
	state = {
		comments: [],
		elements: {},
	};

	getMedia(post) {
		const generateImageComponent = (image) => {
			if (!image.url)
				return;

			const style = {};
			if (image.width && image.height)
				style.aspectRatio = image.width / image.height;

			let url = decodeString(image.url);

			return <Image 
				nativeID="post-media"
				resizeMode="contain"
				style={[styles.image, styles.postMedia, style]}
				source={{ uri: url }}
				onError={(error) => { console.error(error); }}
			/>;
		}

		const generateVideoComponent = (video) => {
			if (!video.url)
				return;

			const style = {};
			if (video.width && video.height)
				style.aspectRatio = video.width / video.height;

			video.url = decodeString(video.url);

			// Load audio
			video.audio = { isLoaded: false, isUnavailable: false };
			if (video.audioUrl) {
				const sound = new Audio.Sound();

				// Attempt to load audio
				sound.loadAsync({ uri: video.audioUrl }).then(async () => {
					await fetch(video.audioUrl).then((response) => {
						if (response.ok) {
							video.audio.isLoaded = true;
						} else {
							video.audio.isUnavailable = true;
						}
					}).catch(() => {});

					if (video.audio.isUnavailable)
						return;

					// Add audio controls

					video.audio.play = async () => {
						if (!video.audio.isLoaded)
							return;

						await sound.playAsync();
					};
	
					video.audio.pause = async () => {
						if (!video.audio.isLoaded)
							return;

						await sound.pauseAsync();
					};
				}).catch(() => {
					video.audio.isLoaded = false;
				});
			}

			this.video = video;

			return <Video
				nativeID="post-media"
				source={{ uri: video.url }}
				style={[styles.image, styles.postMedia, style]}
				videoStyle={[styles.image]}
				resizeMode={ResizeMode.CONTAIN}
				useNativeControls
				isLooping
				onError={(error) => { console.error(error); }}
				onPlaybackStatusUpdate={(status) => {
					if (status.isPlaying) {
						video.audio.play?.();
					} else {
						video.audio.pause?.();
					}
				}}
			/>;
		}

		if (post.media || (post.preview && post.preview.reddit_video_preview)) {
			let video;
	
			if (post.media && post.media.reddit_video) {
				video = post.media.reddit_video;
				video.url = video.fallback_url.substring(0, video.fallback_url.length - 16);
			} else if (post.preview && post.preview.reddit_video_preview) {
				video = post.preview.reddit_video_preview;
				video.url = video.fallback_url;
				video.isPreview = true;
			}
	
			if (video) {
				// Video
				video.audioUrl = video.url.replace(new RegExp("DASH_[0-9]+.mp4"), "DASH_audio.mp4");
				return generateVideoComponent(video);
			} else if (post.media.oembed) {
				// Image
				const image = post.media.oembed;
				image.url = post.media.oembed.thumbnail_url;
				return generateImageComponent(image);
			}
		} else if (post.preview) {
			// Image/GIF
			const image = post.preview.images[0].variants.gif ?? post.preview.images[0].source;
			return generateImageComponent(image);
		}
	}

	loadComments = () => {
		fetchComments(this.props.data.id).then((comments) => {
			console.log("Loaded comments");
			this.setState({ comments });
		}).catch((error) => {
			console.error(error);
		});
	}

	componentDidMount() {
		if (!this.props.preview)
			this.loadComments();
	}

	componentWillUnmount() {
		this.video?.audio?.sound?.unloadAsync?.();
	}

	renderPost() {
		const elements = this.elements;

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
				<View 
					nativeID="post-media-container"
					style={[styles.image, styles.postMediaContainer, { maxHeight: Dimensions.get("window").height * 0.8}]}
				>
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

	renderComment = ({ item: comment }) => {
		if (comment == 0) {
			return this.renderPost();
		} else {
			const hasBody = (comment.data.body != null);
			const hasChildren = (comment.data.children != null && comment.data.children.length > 0);

			if (!hasBody && !hasChildren)
				return null;

			if (hasBody) {
				return <Comment key={comment.data.id} data={comment.data}/>;
			} else if (hasChildren) {
				return (<View key={comment.data.id}>
					{ comment.data.children.map((child) => this.renderComment({ item: child })) }
				</View>);
			}
		}
	}

	render() {
		const post = this.props.data;
		const isPreview = this.props.preview;

		if (!post)
			return;

		function generateCounterComponent(iconName, label, value) {
			const color = Colors.text.tertiary;

			return (<View style={[styles.postCounter]}>
				<FontAwesomeIcon icon={iconName} color={color} size={16} style={Styles.icon}/>
				<Text nativeID={label} style={[Styles.text, { color, fontSize: 12 }]}>{value}</Text>
			</View>);
		}

		this.elements = {
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

			const bodyTagStyles = {};

			Object.assign(bodyTagStyles, tagStyles.common);

			if (isPreview) {
				Object.assign(bodyTagStyles, tagStyles.preview);
			} else {
				Object.assign(bodyTagStyles, tagStyles.full);
			}

			this.elements.body = (<View style={[styles.postBody, { maxHeight: (isPreview ? 100 : null) }]}>
				<RenderHTML
					contentWidth={Dimensions.get("window").width}
					style={Styles.text}
					source={{ html }}
					tagsStyles={bodyTagStyles}
				/>
			</View>);
		}

		if (isPreview) {
			return (<TouchableOpacity
				activeOpacity={0.65}
				nativeID="post-container"
				style={[Styles.container, styles.post, { maxHeight: Dimensions.get("window").height * 0.8 }]}
				onPress={(event) => {
					console.log(event.currentTarget.props);
					const isMedia = (event.target.memoizedProps?.nativeID == "post-media");

					if (!isMedia)
						this.props.navigation.navigate("Post", { data: post })
				}}
			>
				<View nativeID="post-header-container" style={[styles.postHeader]}>
					<View nativeID="post-subreddit-container" style={[styles.postSubreddit]}>
						{this.elements.subredditIcon}
						{this.elements.subreddit}
					</View>
					{this.elements.timestamp}
				</View>
				{this.elements.title}
				{this.elements.body}
				<View nativeID="post-media-container" style={[styles.image, styles.postMediaContainer]}>
					{this.elements.media}
				</View>
				<View nativeID="post-footer-container" style={styles.postFooter}>
					{this.elements.upvotes}
					{this.elements.comments}
					{this.elements.crossposts}
				</View>
			</TouchableOpacity>);
		} else {
			return (<FlatList
				style={{ width: Dimensions.get("window").width }}
				data={[0].concat(this.state.comments)}
				renderItem={this.renderComment}
			>
				<View nativeID="post-header-container" style={[styles.postHeader]}>
					<View nativeID="post-subreddit-container" style={[styles.postSubreddit]}>
						{this.elements.subredditIcon}
						{this.elements.subreddit}
					</View>
					{this.elements.timestamp}
				</View>
				{this.elements.title}
				{this.elements.body}
				<View nativeID="post-media-container" style={[styles.image, styles.postMediaContainer]}>
					{this.elements.media}
				</View>
				<View nativeID="post-footer-container" style={styles.postFooter}>
					{this.elements.upvotes}
					{this.elements.comments}
					{this.elements.crossposts}
				</View>
			</FlatList>);
		}
	}
}

const tagStyles = {
	common: {
		body: {
			marginTop: -14,
			marginBottom: -14,
			maxWidth: "100%"
		},
	},
	preview: {
		p: {
			color: Colors.text.secondary
		},
		a: {
			color: Colors.accentColor.secondary,
			textDecorationColor: Colors.accentColor.secondary
		}
	},
	full: {
		p: {
			color: Colors.text.primary
		},
		a: {
			color: Colors.accentColor.primary,
			textDecorationColor: Colors.accentColor.primary
		}
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