import React, { useState, useLayoutEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { db } from "../firebase";
import { doc, updateDoc, deleteDoc  } from "firebase/firestore";

export default function UpdateScreen({ navigation, route }) {
  const { item } = route.params;

  const [title, setTitle] = useState(item.title);
  const [amount, setAmount] = useState(item.amount.toString());
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Update Transaction",
      headerTitleAlign: "left",
    });
  }, []);

  const deleteTransaction = async () => {
  try {
    const docRef = doc(db, "transactions", item.id);

    await deleteDoc(docRef);

    alert("Deleted Successfully 🗑️");
    navigation.goBack();
  } catch (error) {
    alert(error.message);
  }
};

  const updateTransaction = async () => {
    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, "transactions", item.id);

      await updateDoc(docRef, {
        title: title,
        amount: Number(amount),
      });

      alert("Updated Successfully ✅");
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
            Update Transaction ✏️
          </Text>

          <Input
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <Input
            placeholder="Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

         <Button
  title="Update"
  onPress={updateTransaction}
  loading={loading}
  buttonStyle={{
    backgroundColor: "#0A84FF",
    borderRadius: 10,
    padding: 12,
  }}
/>

<Button
  title="Delete"
  onPress={deleteTransaction}
  buttonStyle={{
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  }}
/>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}