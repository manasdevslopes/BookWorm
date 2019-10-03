import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from "react-native";
import colors from "../assets/colors.js";
import CustomActionButton from "../components/CustomActionButton.js";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoading: false
    };
  }
  onSignIn = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);
        if (response) {
          this.setState({ isLoading: false });
          this.props.navigation.navigate("LoadingScreen");
        }
      } catch (error) {
        this.setState({ isLoading: false });
        switch (error.code) {
          case "auth/user-not-found":
            alert("A user with that email doesnot exist. Try signing Up");
            break;
          case "auth/invalid-email":
            alert("Please enter an Email address.");
        }
      }
    } else {
      this.setState({ isLoading: false });
      alert("Please enter Email and Password");
    }
  };
  onSignUp = async () => {
    if (this.state.email && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );
        if (response) {
          this.setState({ isLoading: false });

          const user = await firebase
            .database()
            .ref("users/")
            .child(response.user.uid)
            .set({ email: response.user.email, uid: response.user.uid });

          this.props.navigation.navigate("LoadingScreen");

          // this.onSignIn(this.state.email, this.state.password);
        }
      } catch (error) {
        this.setState({ isLoading: false });
        if (error.code == "auth/email-already-in-use") {
          alert("User already Exists. Try Loggin in");
        }
      }
    } else {
      this.setState({ isLoading: false });
      alert("Please Enter Email and Password");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              elevation: 1000
            }}
          >
            <ActivityIndicator size="large" color={colors.logoColor} />
          </View>
        ) : null}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TextInput
            style={styles.textInput}
            placeholder="abc@example.com"
            placeholderTextColor={colors.bgTextInputDark}
            keyboardType="email-address"
            onChangeText={email => this.setState({ email: email })}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter password"
            placeholderTextColor={colors.bgTextInputDark}
            secureTextEntry
            onChangeText={password => this.setState({ password: password })}
          />
          <CustomActionButton
            style={{ ...styles.loginButton, borderColor: colors.bgPrimary }}
            onPress={() => this.onSignIn()}
          >
            <View>
              <Text style={{ color: colors.bgColor }}>LogIn</Text>
            </View>
          </CustomActionButton>
          <CustomActionButton
            style={{ ...styles.loginButton, borderColor: colors.bgError }}
            onPress={() => this.onSignUp()}
          >
            <View>
              <Text style={{ color: colors.bgColor }}>Sign Up</Text>
            </View>
          </CustomActionButton>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain
  },
  textInput: {
    height: 50,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    marginHorizontal: 40,
    marginBottom: 10,
    color: colors.bgColor,
    paddingHorizontal: 10
  },
  loginButton: {
    borderWidth: 0.5,
    backgroundColor: "transparent",
    marginTop: 10,
    width: 200,
    alignSelf: "center"
  }
});
