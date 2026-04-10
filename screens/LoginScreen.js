import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image, Button, Input } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const signin = async () => {
    if (email && password) {
      setSubmitLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.replace("Home");
      } catch (error) {
        alert(error.message);
      }
      setSubmitLoading(false);
    } else {
      alert("Please enter email and password");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: loading ? "Loading..." : "Login",
    });
  }, [loading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar style="dark" />

          <Image
  source={require("../assets/image.png")}
  style={{ width: 200, height: 200, borderRadius: 100 }}
/>

          <View style={{ width: 300, marginTop: 20 }}>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Button
              onPress={signin}
              loading={submitLoading}
              title="Login"
            />

            <Button
              title="Register"
              type="clear"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}