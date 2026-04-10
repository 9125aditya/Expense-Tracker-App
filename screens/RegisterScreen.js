import React, { useState } from "react";
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
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const register = async () => {
    if (email && password && name) {
      setSubmitLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: name,
        });

        await auth.currentUser.reload();

        navigation.replace("Home");
      } catch (error) {
        alert(error.message);
      }
      setSubmitLoading(false);
    } else {
      alert("Please enter all fields");
    }
  };

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
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />

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
              onPress={register}
              loading={submitLoading}
              title="Register"
            />

            <Button
              title="Go to Login"
              type="clear"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}