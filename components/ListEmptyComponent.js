import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import colors from "../assets/colors";

const ListEmptyComponent = ({ text }) => {
  return (
    <View style={styles.flatlistView}>
      <Text style={{ fontWeight: "bold", color: colors.bgColor }}>{text}</Text>
    </View>
  );
};
ListEmptyComponent.propTypes = {
  text: PropTypes.string.isRequired
};
export default ListEmptyComponent;
const styles = StyleSheet.create({
  flatlistView: { marginTop: 50, alignItems: "center" }
});
