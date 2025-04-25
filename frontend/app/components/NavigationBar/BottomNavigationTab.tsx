import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import UploadsBar from "./UploadsBar";
import StudyBar from "./StudyBar";
import InsightsBar from "./InsightsBar";
import ProfileBar from "./ProfileBar";
import DocumentSets from "@/app/pages/DocumentSets";

const Tab = createBottomTabNavigator();

const BottomNavigationBar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="Uploads"
        component={DocumentSets}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              style={{ alignItems: "center", justifyContent: "center", top: 5 }}
            >
              <Image
                source={require("../../../assets/images/book-copy.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#0066FF" : "gray",
                }}
              />
              <Text
                style={{ color: focused ? "#0066FF" : "gray", fontSize: 12 }}
              >
                Sets
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Study"
        component={StudyBar}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              style={{ alignItems: "center", justifyContent: "center", top: 5 }}
            >
              <Image
                source={require("../../../assets/images/notepad-text.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#0066FF" : "gray",
                }}
              />
              <Text
                style={{ color: focused ? "#0066FF" : "gray", fontSize: 12 }}
              >
                Study
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Insights"
        component={InsightsBar}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              style={{ alignItems: "center", justifyContent: "center", top: 5 }}
            >
              <Image
                source={require("../../../assets/images/chart-column-increasing.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#0066FF" : "gray",
                }}
              />
              <Text
                style={{ color: focused ? "#0066FF" : "gray", fontSize: 12 }}
              >
                Insights
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileBar}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View
              style={{ alignItems: "center", justifyContent: "center", top: 5 }}
            >
              <Image
                source={require("../../../assets/images/user.png")}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? "#0066FF" : "gray",
                }}
              />
              <Text
                style={{ color: focused ? "#0066FF" : "gray", fontSize: 12 }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigationBar;
