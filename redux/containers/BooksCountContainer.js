import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import colors from "../../assets/colors";
import PropTypes from "prop-types";

const BooksCountContainer = ({ color, type, ...props }) => (
  <View style={styles.container}>
    <Text style={{ color: color }}>{props.books[type].length || 0}</Text>
  </View>
);

BooksCountContainer.defaultProps = {
  color: colors.textPlaceholder
};
BooksCountContainer.propTypes = {
  color: PropTypes.string,
  type: PropTypes.string.isRequired
};
const mapStateToProps = state => {
  return {
    books: state.books
  };
};
export default connect(mapStateToProps)(BooksCountContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
