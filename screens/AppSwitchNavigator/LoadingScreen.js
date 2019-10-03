import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";
import colors from "../../assets/colors.js";

import * as firebase from "firebase/app";
import "firebase/auth";

export default class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //Navigation to home screen
        this.props.navigation.navigate("HomeScreen", { user: user });
      } else {
        //navigate to login screen
        this.props.navigation.navigate("LoginStackNavigator");
      }
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.logoColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgMain
  }
});
