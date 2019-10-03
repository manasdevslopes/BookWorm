import React, { Component } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/colors.js";
import CustomActionButton from "../../components/CustomActionButton.js";

export default class WelcomeScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgMain }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Ionicons name="ios-bookmarks" size={150} color={colors.logoColor} />
          <Text
            style={{ fontSize: 50, fontWeight: "100", color: colors.bgColor }}
          >
            Book Worm
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center"
          }}
        >
          <CustomActionButton
            title="Log In"
            style={{
              width: 200,
              backgroundColor: "transparent",
              borderWidth: 0.5,
              borderColor: colors.bgPrimary,
              marginBottom: 10
            }}
            onPress={() => this.props.navigation.navigate("LoginScreen")}
          >
            <Text
              style={{ fontWeight: "100", fontSize: 30, color: colors.bgColor }}
            >
              Login
            </Text>
          </CustomActionButton>
          {/* <CustomActionButton
            title="Sign Up"
            style={{
              width: 200,
              backgroundColor: "transparent",
              borderWidth: 0.5,
              borderColor: colors.bgError
            }}
            onPress={() => this.props.navigation.navigate("SignUpScreen")}
          >
            <Text
              style={{ fontWeight: "100", fontSize: 30, color: colors.bgColor }}
            >
              Sign Up
            </Text>
          </CustomActionButton>
         */}
        </View>
      </View>
    );
  }
}
