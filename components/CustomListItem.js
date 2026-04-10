import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@rneui/themed";

export default function CustomListItem({
  title,
  amount,
  type,
  onPress,
}) {
  const isExpense = type === "expense";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={{
        backgroundColor: "#2C2C2E",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
        <Text style={{ color: "#fff" }}>{title}</Text>

        <Text style={{
          color: isExpense ? "#FF3B30" : "#00FF7F",
          fontWeight: "bold"
        }}>
          ₹ {amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}