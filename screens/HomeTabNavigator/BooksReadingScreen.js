import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList
} from "react-native";
import colors from "../../assets/colors.js";
import ListItem from "../../components/ListItem";
import { connect } from "react-redux";
import ListEmptyComponent from "../../components/ListEmptyComponent.js";

class BooksReadingScreen extends Component {
  renderItem = item => {
    return <ListItem item={item} />;
  };
  render() {
    return (
      <View style={styles.container}>
        {this.props.books.isLoadingBooks && (
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
        )}
        <FlatList
          data={this.props.books.booksReading}
          renderItem={({ item }, index) => this.renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            !this.props.books.isLoadingBooks && (
              <ListEmptyComponent text="Not Reading any Books." />
            )
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    books: state.books
  };
};

export default connect(mapStateToProps)(BooksReadingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain
  }
});
