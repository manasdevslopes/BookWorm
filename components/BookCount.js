import React, { Component } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import PropTypes from "prop-types";

//Function Component
const BookCount = ({ title, count }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>{title}</Text>
      <Text>{count}</Text>
    </View>
  );
};
BookCount.propTypes = {
  count: PropTypes.number,
  title: PropTypes.string
};
export default BookCount;

//Class Component
// export default class BookCount extends Component {
//   render() {
//     return (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//           <Text style={{ fontSize: 20 }}>{this.props.title}</Text>
//           <Text>{this.props.count}</Text>
//         </View>
//       );
//   }
// }
