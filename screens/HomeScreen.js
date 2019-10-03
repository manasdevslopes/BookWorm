import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import BookCount from "../components/BookCount.js";
import { Ionicons } from "@expo/vector-icons";
import CustomActionButton from "../components/CustomActionButton.js";
import colors from "../assets/colors.js";
import SwipeOut from "react-native-swipeout";

import * as firebase from "firebase/app";
import "firebase/storage";
import { snapshotToArray } from "../screens/helpers/firebaseHelpers.js";
import * as ImageHelpers from "../screens/helpers/ImageHelpers.js";

import ListItem from "../components/ListItem.js";
import * as Animatable from "react-native-animatable";

import { connect } from "react-redux";

import ListEmptyComponent from "../components/ListEmptyComponent.js";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      totalCount: 0,
      readingCount: 0,
      readCount: 0,
      isAddNewBookVisible: false,
      textInputData: "",
      books: [],
      booksReading: [],
      booksRead: [],

      currentUser: {}
      // bookData: {
      //   author: "",
      //   publisher: ""
      // }
    };
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam("user");
    console.log("USER", user);
    const currentUserData = await firebase
      .database()
      .ref("users")
      .child(user.uid)
      .once("value");

    const books = await firebase
      .database()
      .ref("books")
      .child(user.uid)
      .once("value");

    const booksArray = snapshotToArray(books);

    this.setState({
      currentUser: currentUserData.val()
      // books: booksArray,
      // booksReading: booksArray.filter(book => !book.read),
      // booksRead: booksArray.filter(book => book.read)
    });
    console.log("Current user", this.state.currentUser);

    this.props.loadBooks(booksArray.reverse());
    this.props.toggleIsLoadingBooks(false);
    console.log(this.props.books);
  };

  showAddNewBook = () => {
    this.setState({
      isAddNewBookVisible: true
    });
  };
  hideAddNewBook = () => {
    this.setState({
      isAddNewBookVisible: false
    });
  };
  addBook = async book => {
    try {
      //books
      //users uid
      //book id(key)
      //books data
      this.props.toggleIsLoadingBooks(true);
      const snapshot = await firebase
        .database()
        .ref("books")
        .child(this.state.currentUser.uid)
        .orderByChild("name")
        .equalTo(book)
        .once("value");

      if (snapshot.exists()) {
        alert("Unable to add as book already exists");
      } else {
        const key = await firebase
          .database()
          .ref("books")
          .child(this.state.currentUser.uid)
          .push().key;
        const response = await firebase
          .database()
          .ref("books")
          .child(this.state.currentUser.uid)
          .child(key)
          .set({ name: book, read: false });
        this.setState(
          (state, props) => ({
            textInputData: "",
            isAddNewBookVisible: false
          }),
          () => {
            console.log("Books", this.state);
          }
        );
        this.props.addBook({ name: book, read: false, key: key });
        this.props.toggleIsLoadingBooks(false);
      }
    } catch (e) {
      console.log(e);
      this.props.toggleIsLoadingBooks(false);
    }
  };

  markAsRead = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBooks(true);
      await firebase
        .database()
        .ref("books")
        .child(this.state.currentUser.uid)
        .child(selectedBook.key)
        .update({ read: true });

      let books = this.state.books.map(book => {
        if (book.name === selectedBook.name) {
          return { ...book, read: true };
        }
        return book;
      });
      let booksReading = this.state.booksReading.filter(
        book => book.name !== selectedBook.name
      );

      this.setState(prevState => ({
        books: books,
        booksReading: booksReading,
        booksRead: [
          ...prevState.booksRead,
          { name: selectedBook.name, read: true }
        ]
        // readingCount: prevState.readingCount - 1,
        // readCount: prevState.readCount + 1
      }));

      this.props.markBookAsRead(selectedBook);
      this.props.toggleIsLoadingBooks(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingBooks(false);
    }
  };

  markAsUnread = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBooks(true);
      await firebase
        .database()
        .ref("books")
        .child(this.state.currentUser.uid)
        .child(selectedBook.key)
        .update({ read: false });
      this.props.markBookAsUnRead(selectedBook);
      this.props.toggleIsLoadingBooks(false);
    } catch (e) {
      console.log(error);
      this.props.toggleIsLoadingBooks(false);
    }
  };
  deleteBook = async (selectedBook, index) => {
    try {
      this.props.toggleIsLoadingBooks(true);
      await firebase
        .database()
        .ref("books")
        .child(this.state.currentUser.uid)
        .child(selectedBook.key)
        .remove();
      this.props.deleteBook(selectedBook);
      this.props.toggleIsLoadingBooks(false);
    } catch (error) {
      console.log(error);
      this.props.toggleIsLoadingBooks(false);
    }
  };
  uploadImage = async (image, selectedBook) => {
    const ref = firebase
      .storage()
      .ref("books")
      .child(this.state.currentUser.uid)
      .child(selectedBook.key);
    try {
      //converting to blob
      const blob = await ImageHelpers.prepareBlob(image.uri);
      const snapshot = await ref.put(blob);

      let downloadUrl = await ref.getDownloadURL();

      await firebase
        .database()
        .ref("books")
        .child(this.state.currentUser.uid)
        .child(selectedBook.key)
        .update({ image: downloadUrl });

      blob.close();

      return downloadUrl;
    } catch (e) {
      console.log(e);
    }
  };
  openImageLibrary = async selectedBook => {
    const result = await ImageHelpers.openImageLibrary();
    if (result) {
      this.props.toggleIsLoadingBooks(true);
      const downloadUrl = await this.uploadImage(result, selectedBook);
      this.props.updateBookImage({ ...selectedBook, uri: downloadUrl });
      this.props.toggleIsLoadingBooks(false);
    }
  };
  openCamera = async selectedBook => {
    const result = await ImageHelpers.openCamera();
    if (result) {
      this.props.toggleIsLoadingBooks(true);
      const downloadUrl = await this.uploadImage(result, selectedBook);
      this.props.updateBookImage({ ...selectedBook, uri: downloadUrl });
      this.props.toggleIsLoadingBooks(false);
    }
  };
  addBookImage = selectedBook => {
    const options = ["Select From Gallery", "Open Camera", "Cancel"];
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        if (buttonIndex == 0) {
          this.openImageLibrary(selectedBook);
        } else if (buttonIndex == 1) {
          this.openCamera(selectedBook);
        }
      }
    );
  };
  renderItem = (item, index) => {
    let swipeoutButtons = [
      {
        text: "Delete",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="ios-trash" size={24} color={colors.bgMain} />
          </View>
        ),
        backgroundColor: colors.bgDelete,
        onPress: () => {
          this.deleteBook(item, index);
        }
      }
    ];
    if (!item.read) {
      swipeoutButtons.unshift({
        text: "Mark Read",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: colors.bgColor }}>Mark As Read</Text>
          </View>
        ),
        backgroundColor: colors.bgSuccessDark,
        onPress: () => {
          this.markAsRead(item, index);
        }
      });
    } else {
      swipeoutButtons.unshift({
        text: "Mark Unread",
        component: (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: colors.bgColor }}>Mark Unread</Text>
          </View>
        ),
        backgroundColor: colors.bgUnread,
        onPress: () => {
          this.markAsUnread(item, index);
        }
      });
    }
    return (
      <SwipeOut
        backgroundColor={colors.bgMain}
        right={swipeoutButtons}
        autoClose={true}
        style={{ marginHorizontal: 5, marginVertical: 5 }}
      >
        <ListItem
          editable={true}
          marginVertical={0}
          item={item}
          onPress={() => this.addBookImage(item)}
        >
          {item.read && (
            <Ionicons
              style={{ marginRight: 5 }}
              name="ios-checkmark"
              color={colors.logoColor}
              size={30}
            />
          )}
        </ListItem>
      </SwipeOut>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView />
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Book Worm</Text>
        </View> */}
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
          <View style={styles.textInputContainer}>
            <TextInput
              onChangeText={text => this.setState({ textInputData: text })}
              value={this.state.textInputData}
              style={styles.textInputs}
              placeholder="Enter Book Name"
              placeholderTextColor={colors.textPlaceholder}
            />
          </View>
          {/* {this.state.isAddNewBookVisible && (
            <View style={styles.textInputContainer}>
              <TextInput
                onChangeText={text => this.setState({ textInputData: text })}
                value={this.state.textInputData}
                style={styles.textInputs}
                placeholder="Enter Book Name"
                placeholderTextColor="grey"
              />
              {this.state.textInputData === "" ? (
                <CustomActionButton
                  style={{ backgroundColor: colors.bgSuccess }}
                  // onPress={() => this.addBook(this.state.textInputData)}
                >
                  <Ionicons name="ios-checkmark" color="white" size={40} />
                </CustomActionButton>
              ) : (
                <CustomActionButton
                  style={{ backgroundColor: colors.bgSuccess }}
                  onPress={() => this.addBook(this.state.textInputData)}
                >
                  <Ionicons name="ios-checkmark" color="white" size={40} />
                </CustomActionButton>
              )}
              <CustomActionButton
                style={{ backgroundColor: colors.bgError }}
                onPress={() => this.hideAddNewBook()}
              >
                <Ionicons name="ios-close" color="white" size={40} />
              </CustomActionButton>
            </View>
          )} */}
          <FlatList
            data={this.props.books.books}
            renderItem={({ item }, index) => this.renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              !this.props.books.isLoadingBooks && (
                <ListEmptyComponent text="Not Reading any Books." />
              )
            }
          />
          <Animatable.View
            animation={
              this.state.textInputData.length > 0
                ? "slideInRight"
                : "slideOutRight"
            }
          >
            <CustomActionButton
              onPress={() => this.addBook(this.state.textInputData)}
              position="right"
              style={{
                borderRadius: 25,
                backgroundColor: colors.bgPrimary
              }}
            >
              <Text style={{ color: colors.bgColor, fontSize: 30 }}>+</Text>
            </CustomActionButton>
          </Animatable.View>
        </View>
        {/* <View style={styles.footerView}>
          <BookCount title="Total Books" count={this.state.books.length} />
          <BookCount title="Reading" count={this.state.booksReading.length} />
          <BookCount title="Read" count={this.state.booksRead.length} />
        </View> */}
        <SafeAreaView />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    books: state.books
  };
};
const mapDispatchToProps = dispatch => {
  return {
    loadBooks: books =>
      dispatch({
        type: "LOAD_BOOKS_FROM_SERVER",
        payload: books
      }),
    addBook: book => dispatch({ type: "ADD_BOOK", payload: book }),
    markBookAsRead: book =>
      dispatch({ type: "MARK_BOOK_AS_READ", payload: book }),
    markBookAsUnRead: book =>
      dispatch({ type: "MARK_BOOK_AS_UNREAD", payload: book }),
    deleteBook: book => dispatch({ type: "DELETE_BOOK", payload: book }),
    toggleIsLoadingBooks: bool =>
      dispatch({ type: "TOOGLE_IS_LOADING_BOOKS", payload: bool }),

    updateBookImage: book =>
      dispatch({ type: "UPADATE_BOOK_IMAGE", payload: book })
  };
};

const wrapper = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  connectActionSheet
);
export default wrapper(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain
  },

  listItemContainer: {
    flex: 1,
    minHeight: 100,
    flexDirection: "row",
    backgroundColor: colors.listItemBg,
    alignItems: "center",
    marginVertical: 5
  },
  imageContainer: {
    width: 70,
    height: 70,
    marginLeft: 10
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    borderRadius: 35
  },
  listItemTitleContainer: { flex: 1, justifyContent: "center", paddingLeft: 5 },
  listItemTitles: { fontWeight: "100", fontSize: 22, color: colors.bgColor },
  markAsReadButton: { width: 100, backgroundColor: colors.bgSuccess },
  markAsReadButtonText: { fontWeight: "bold", color: colors.bgColor },
  header: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColor,
    alignItems: "center",
    justifyContent: "center"
  },
  headerTitle: { fontSize: 24 },
  textInputContainer: { height: 50, flexDirection: "row", margin: 5 },
  textInputs: {
    flex: 1,
    backgroundColor: "transparent",
    paddingLeft: 5,
    borderColor: colors.listItemBg,
    borderBottomWidth: 5,
    fontSize: 22,
    fontWeight: "200",
    color: colors.bgColor
  },
  flatlistView: { marginTop: 50, alignItems: "center" },
  footerView: {
    height: 70,
    borderTopWidth: 0.5,
    borderTopColor: colors.borderColor,
    flexDirection: "row"
  }
});
