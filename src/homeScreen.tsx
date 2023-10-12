import React, { Component } from "react";
import { Keyboard, ScrollView, TouchableWithoutFeedback, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import Notifications from "./notifications";

interface State {
	token?: string;
	modalMessage?: string;
}

export default class HomeScreen extends Component<{}, State> {

	constructor(props: Readonly<{}>) {
		super(props);

		this.state = {
			token: Notifications.settings?.token,
		};
	}

	render() {
		return <SafeAreaInsetsContext.Consumer>
			{insets => <TouchableWithoutFeedback onPress={Keyboard.dismiss} touchSoundDisabled={true} style={{ flex: 1 }}>
				<ScrollView
					style={{ paddingTop: insets?.top, flex: 1, backgroundColor: "black" }}
				>
					{this.renderModal()}
					{this.renderContent()}
				</ScrollView>
			</TouchableWithoutFeedback>
			}
		</SafeAreaInsetsContext.Consumer>
	}

	renderContent() {
		const action = this.state.token ? "Disable Notifications" : "Enable Notifications";

		return <View style={{ flex: 1, backgroundColor: "#222", padding: 40 }}>
			<Text style={{ fontSize: 20, marginBottom: 20 }}>Hello World</Text>
			<Text>Push Token:</Text>
			<Text selectable>{this.state.token || "not registered"}</Text>
			<Button style={{ marginTop: 20 }} mode="contained" onPress={() => this.onPress()}>{action}</Button>
		</View>
	}

	renderModal() {
		return <Portal>
			<Modal
				visible={!!this.state.modalMessage}
				onDismiss={() => this.setState({ modalMessage: undefined })}
				contentContainerStyle={[{ maxHeight: "80%" }]}>
				<View style={{ backgroundColor: "black", margin: 10, padding: 20 }}>
					<Text>{this.state.modalMessage}</Text>
				</View>
			</Modal>
		</Portal>
	}

	onPress() {
		Notifications.register().then(() => {
			this.setState({ token: Notifications.settings?.token });
		}).catch(error => {
			this.setState({ modalMessage: JSON.stringify(error) + "\n\n" + error.toString() });
		});
	}
}