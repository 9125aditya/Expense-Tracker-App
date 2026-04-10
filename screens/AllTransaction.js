import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, FlatList } from "react-native";
import { Text } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { db } from "../firebase";
import CustomListItem from "../components/CustomListItem";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function AllTransactions({ navigation }) {
  const [transactions, setTransactions] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Transactions",
      headerTitleAlign: "left",
    });
  }, [navigation]);

  // 🔥 FETCH ALL DATA
  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(data);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <StatusBar style="dark" />

      <View style={{ flex: 1, padding: 15 }}>
        
        {transactions.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No transactions yet
          </Text>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CustomListItem
                title={item.title}
                amount={item.amount}
                type={item.type}
                navigation={navigation}   // 🔥 FIX
                item={item}               // 🔥 FIX
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}