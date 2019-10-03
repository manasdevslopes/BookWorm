import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import PropTypes from "prop-types";
import colors from "../assets/colors.js";

function getPosition(position) {
  switch (position) {
    case "left":
      return { position: "absolute", left: 20, bottom: 270 };
    default:
      return { position: "absolute", right: 20, bottom: 270 };
  }
}
const CustomActionButton = ({ children, onPress, style, position }) => {
  const floatingActionButton = position ? getPosition(position) : [];
  return (
    <TouchableOpacity style={floatingActionButton} onPress={onPress}>
      <View style={[styles.button, style]}>{children}</View>
    </TouchableOpacity>
  );
};

CustomActionButton.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.element.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
CustomActionButton.defaultProps = {
  style: {}
};

export default CustomActionButton;

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    backgroundColor: colors.bgSuccess,
    alignItems: "center",
    justifyContent: "center"
  }
});
