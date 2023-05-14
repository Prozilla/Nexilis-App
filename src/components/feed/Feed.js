import { Component } from "react";
import { Dimensions, FlatList, View } from "react-native";
import { fetchPosts, refreshFeed } from "../..";
import Styles from "../../constants/Styles";
import Post from "./Post";
import Colors from "../../constants/Colors";

export default class Feed extends Component {
	state = {
		posts: [],
		loading: false,
		refreshing: false
	};

	async loadFeed() {
		this.setState({ loading: true });
		fetchPosts().then((posts) => {
			console.log("Loaded feed");
			this.setState({ posts, loading: false });
		}).catch((error) => {
			console.error(error);
		});
	}

	componentDidMount() {
		this.loadFeed();
	}

	extendFeed = async () => {
		this.setState({ loading: true });
		fetchPosts().then((newPosts) => {
			console.log("Extended feed");
			const posts = this.state.posts.concat(newPosts);
			this.setState({ posts, loading: false });
		}).catch((error) => {
			console.error(error);
		})
	}

	refreshFeed = () => {
		this.setState({ loading: true, refreshing: true });
		refreshFeed().then((posts) => {
			console.log("Refreshed feed");
			this.setState({ posts, loading: false, refreshing: false });
		}).catch((error) => {
			console.error(error);
		});
	}

	scrollToTop = () => {
		this.list.scrollToOffset({ offset: 0 });
	}

	renderPost({ item: post }) {
		return (
			<View>
				<Post data={post}/>
				<View
					style={{
						width: "100%",
						height: 2,
						backgroundColor: Colors.background.tertiary
					}}
				/>
			</View>
		);
	}

	render() {
		this.list = (
			<FlatList
				style={{ width: Dimensions.get("window").width }}
				data={this.state.posts}
				renderItem={this.renderPost}
				onEndReachedThreshold={1}
				onEndReached={this.extendFeed}
				refreshing={this.state.refreshing}
				onRefresh={this.refreshFeed}
			/>
		);

		return (
			<View style={Styles.container}>
				{this.list}
			</View>
		);
	}
}