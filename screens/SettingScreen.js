import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../assets/colors.js";
import CustomActionButton from "../components/CustomActionButton.js";

import * as firebase from "firebase/app";
import "firebase/auth";

export default class SettingScreen extends Component {
  signOut = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("WelcomeScreen");
    } catch (error) {
      alert("Unable to sign out right now.");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.bgColor }}>Settings Screen</Text>
        <CustomActionButton
          onPress={this.signOut}
          style={styles.markAsReadButton}
        >
          <Text style={styles.markAsReadButtonText}>Log Out</Text>
        </CustomActionButton>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgMain
  },
  markAsReadButton: { width: 100, backgroundColor: colors.bgSuccess },
  markAsReadButtonText: { fontWeight: "bold", color: colors.bgColor }
});
