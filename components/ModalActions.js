import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { Text } from "@rneui/themed";

export default function ModalActions({
  visible,
  onClose,
  onEdit,
  onDelete,
}) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <TouchableOpacity onPress={onEdit}>
            <Text style={{ fontSize: 18, marginBottom: 15 }}>
              ✏️ Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Text style={{ fontSize: 18, color: "red" }}>
              🗑 Delete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                textAlign: "center",
                marginTop: 20,
                color: "gray",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}