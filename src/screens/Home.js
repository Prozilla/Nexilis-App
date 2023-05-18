import { Component } from "react";
import Styles from "../constants/Styles";
import Feed from "../components/feed/Feed";
import FooterView from "../components/footer/FooterView";

export default class HomeScreen extends Component {
	render() {
		return (
			<FooterView style={Styles.screen} navigation={this.props.navigation}>
				<Feed style={Styles.container} navigation={this.props.navigation}/>
			</FooterView>
		);
	}
}