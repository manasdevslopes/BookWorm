import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform
} from "react-native";
import colors from "../../assets/colors.js";
import { Ionicons } from "@expo/vector-icons";
import { DrawerItems } from "react-navigation";

export default class CustomDrawerComponent extends Component {
  render() {
    return (
      <ScrollView>
        <SafeAreaView style={{ backgroundColor: colors.bgMain }} />
        <View style={styles.container}>
          <Ionicons name="ios-bookmarks" size={100} color={colors.logoColor} />
          <Text
            style={{ fontSize: 24, color: colors.bgColor, fontWeight: "100" }}
          >
            Book Worm
          </Text>
        </View>
        <DrawerItems {...this.props} />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 150,
    backgroundColor: colors.bgMain,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS == "android" ? 20 : 0
  }
});
