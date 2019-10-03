import React, { Component } from "react";
import WelcomeScreen from "./screens/AppSwitchNavigator/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen.js";
import BooksReadingScreen from "./screens/HomeTabNavigator/BooksReadingScreen.js";
import BooksReadScreen from "./screens/HomeTabNavigator/BooksReadScreen.js";
import SettingScreen from "./screens/SettingScreen.js";
import LoginScreen from "./screens/LoginScreen.js";
import LoadingScreen from "./screens/AppSwitchNavigator/LoadingScreen.js";
import CustomDrawerComponent from "./screens/DrawerNavigator/CustomDrawerComponent.js";
import colors from "./assets/colors.js";

import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase/app";
import { firebaseConfig } from "./config/config.js";

import { Provider } from "react-redux";
import store from "./redux/store/index.js";

import BooksCountContainer from "./redux/containers/BooksCountContainer";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const LoginStackNavigator = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
        header: null
      }
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {
        headerStyle: {
          backgroundColor: colors.bgMain
        }
      }
    }
  },
  {
    mode: "modal",
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColr: colors.bgMain
      }
    }
  }
);
const HomeTabNavigator = createBottomTabNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: "Total Books",
        tabBarIcon: ({ tintcolor }) => (
          <BooksCountContainer color={tintcolor} type="books" />
        )
      }
    },
    BooksReadingScreen: {
      screen: BooksReadingScreen,
      navigationOptions: {
        tabBarLabel: "Reading",
        tabBarIcon: ({ tintcolor }) => (
          <BooksCountContainer color={tintcolor} type="booksReading" />
        )
      }
    },
    BooksReadScreen: {
      screen: BooksReadScreen,
      navigationOptions: {
        tabBarLabel: "Read",
        tabBarIcon: ({ tintcolor }) => (
          <BooksCountContainer color={tintcolor} type="booksRead" />
        )
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: colors.bgMain
      },
      activeTintColor: colors.logoColor,
      inactiveTintColor: colors.bgTextInput
    }
  }
);

HomeTabNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  switch (routeName) {
    case "HomeScreen":
      return {
        headerTitle: "Total Books"
      };
    case "BooksReadingScreen":
      return {
        headerTitle: "Books Reading"
      };
    case "BooksReadScreen":
      return {
        headerTitle: "Books Read"
      };
    default:
      return {
        headerTitle: "Book Worm"
      };
  }
};

const HomeStackNavigator = createStackNavigator(
  {
    HomeTabNavigator: {
      screen: HomeTabNavigator,
      navigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Ionicons
              name="ios-menu"
              size={30}
              color={colors.logoColor}
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 10 }}
            />
          )
        };
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.bgMain
      },
      headerTintColor: colors.bgColor
    }
  }
);
const AppDrawerNavigator = createDrawerNavigator(
  {
    HomeStackNavigator: {
      screen: HomeStackNavigator,
      navigationOptions: {
        title: "Home",
        drawerIcon: () => <Ionicons name="ios-home" size={24} />
      }
    },
    // HomeScreen: {
    //   screen: HomeScreen,
    //   navigationOptions: {
    //     title: "Home",
    //     drawerIcon: () => <Ionicons name="ios-home" size={24} />
    //   }
    // },
    SettingsScreen: {
      screen: SettingScreen,
      navigationOptions: {
        title: "Setting",
        drawerIcon: () => <Ionicons name="ios-settings" size={24} />
      }
    }
  },
  {
    contentComponent: CustomDrawerComponent,
    // drawerType: "slide",
    overlayColor: "00FFFFF"
  }
);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen,
  LoginStackNavigator,
  AppDrawerNavigator
});
const AppContainer = createAppContainer(AppSwitchNavigator);

class App extends Component {
  constructor() {
    super();
    this.initializeFirebase();
  }
  initializeFirebase = () => {
    firebase.initializeApp(firebaseConfig);
  };
  render() {
    return (
      <Provider store={store}>
        <ActionSheetProvider>
          <AppContainer />
        </ActionSheetProvider>
      </Provider>
    );
  }
}
// const App = () => <AppContainer />;

export default App;
