import React from "react";
import { View, StyleSheet } from "react-native";
import PointLogo from "../assets/PointLogo";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <PointLogo width={220} height={60} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
