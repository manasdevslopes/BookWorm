import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import colors from "../assets/colors.js";
import NetworkImage from "react-native-image-progress";
import ProgressPie from "react-native-progress/Pie";

const ListItem = ({ item, children, marginVertical, editable, onPress }) => {
  return (
    <View
      style={{ ...styles.listItemContainer, marginVertical: marginVertical }}
    >
      <TouchableOpacity
        disabled={!editable}
        style={{ flex: 1 }}
        onPress={() => onPress(item)}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <NetworkImage
              source={{ uri: item.image }}
              style={styles.image}
              indicator={ProgressPie}
              indicatorProps={{
                size: 40,
                borderWidth: 0,
                color: colors.logoColor,
                unfilledColor: "rgba(200,200,200,0.2)"
              }}
              imageStyle={{ borderRadius: 35 }}
            />
          ) : (
            <Image
              source={require("../assets/manas.jpg")}
              style={styles.image}
            />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.listItemTitleContainer}>
        <Text style={styles.listItemTitles}>{item.name}</Text>
      </View>
      {children}
      {/* {item.read ? (
          <Ionicons name="ios-checkmark" color={colors.logoColor} size={30} />
        ) : (
          <CustomActionButton
            onPress={() => this.markAsRead(item, index)}
            style={styles.markAsReadButton}
          >
            <Text style={styles.markAsReadButtonText}>Mark as Read.</Text>
          </CustomActionButton>
        )} */}
    </View>
  );
};
ListItem.defaultProps = {
  marginVertical: 5,
  editable: false
};
export default ListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flex: 1,
    minHeight: 100,
    flexDirection: "row",
    backgroundColor: colors.listItemBg,
    alignItems: "center"
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
  listItemTitles: { fontWeight: "100", fontSize: 22, color: colors.bgColor }
});
