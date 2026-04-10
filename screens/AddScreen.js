import React, { useState, useLayoutEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddScreen({ navigation }) {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Transaction",
      headerTitleAlign: "left",
    });
  }, []);

  const addTransaction = async () => {
    if (!amount || !title || !category) {
      alert("Please enter all fields");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "transactions"), {
        title,
        category,
        amount: Number(amount),
        type,
        userId: auth.currentUser.uid,
        createdAt: date,
      });

      alert("Transaction Added ✅");
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <StatusBar style="dark" />

      <View style={{ padding: 20 }}>

        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
          Add Transaction
        </Text>

        {/* Title */}
        <Input
          placeholder="Title (Food, Salary...)"
          value={title}
          onChangeText={setTitle}
        />

        {/* Amount */}
        <Input
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Category */}
        <Input
          placeholder="Category (Food, Travel...)"
          value={category}
          onChangeText={setCategory}
        />

        {/* Type Toggle */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Button
            title="Expense"
            onPress={() => setType("expense")}
            buttonStyle={{
              backgroundColor: type === "expense" ? "#FF3B30" : "#ccc",
              width: 150,
            }}
          />

          <Button
            title="Income"
            onPress={() => setType("income")}
            buttonStyle={{
              backgroundColor: type === "income" ? "#34C759" : "#ccc",
              width: 150,
            }}
          />
        </View>

        {/* Date Picker */}
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={{
            backgroundColor: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Text>Select Date: {date.toDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Submit */}
        <Button
          title="Add Transaction"
          onPress={addTransaction}
          loading={loading}
          buttonStyle={{
            backgroundColor: "#0A84FF",
            borderRadius: 10,
            padding: 12,
          }}
        />
      </View>
    </SafeAreaView>
  );
}