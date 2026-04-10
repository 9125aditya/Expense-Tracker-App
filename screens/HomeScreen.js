import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@rneui/themed";
import { auth, db } from "../firebase";
import { StatusBar } from "expo-status-bar";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomListItem from "../components/CustomListItem";
import ModalActions from "../components/ModalActions";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function HomeScreen({ navigation }) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  const [totalIncome, setTotalIncome] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔥 FETCH DATA
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

      const incomeData = data.filter((item) => item.type === "income");
      const expenseData = data.filter((item) => item.type === "expense");

      setTotalIncome(incomeData);
      setTotalExpense(expenseData);
    });

    return unsubscribe;
  }, []);

  // 🔥 CALCULATE TOTALS
  useEffect(() => {
    const incomeSum = totalIncome.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    const expenseSum = totalExpense.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    setIncome(incomeSum);
    setExpense(expenseSum);
  }, [totalIncome, totalExpense]);

  // 🔥 BALANCE
  useEffect(() => {
    setBalance(income - expense);
  }, [income, expense]);

  const signOutUser = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  // 🔥 HEADER
  useLayoutEffect(() => {
    const user = auth.currentUser;
    const firstName = user?.displayName?.split(" ")[0] || "User";

    navigation.setOptions({
      title: `Hi, ${firstName}`,
      headerTitleAlign: "left",
      headerStyle: {
        backgroundColor: "#0A84FF",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: "600",
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={signOutUser}
          style={{ marginRight: 10, padding: 10 }}
        >
          <AntDesign name="logout" size={22} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <StatusBar style="dark" />

      <View style={{ flex: 1, padding: 20 }}>
        
        {/* 💳 BALANCE CARD */}
        <View
          style={{
            backgroundColor: "#1C1C1E",
            borderRadius: 15,
            padding: 20,
            marginBottom: 30,
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>
            Total Balance
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              marginVertical: 10,
              color: balance >= 0 ? "#00FF7F" : "#FF3B30",
            }}
          >
            ₹ {balance}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <View
              style={{
                backgroundColor: "#1C1C1E",
                padding: 15,
                borderRadius: 10,
                width: "48%",
              }}
            >
              <Text style={{ color: "#aaa" }}>Income</Text>
              <Text style={{ color: "#00FF7F", fontWeight: "bold" }}>
                ₹ {income}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#1C1C1E",
                padding: 15,
                borderRadius: 10,
                width: "48%",
              }}
            >
              <Text style={{ color: "#aaa" }}>Expense</Text>
              <Text style={{ color: "#FF3B30", fontWeight: "bold" }}>
                ₹ {expense}
              </Text>
            </View>
          </View>
        </View>

        {/* 🔥 RECENT TRANSACTIONS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Recent Transactions
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("AllTransaction")}
          >
            <Text style={{ color: "#0A84FF" }}>See all</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#1C1C1E",
            borderRadius: 15,
            padding: 15,
          }}
        >
          {[...totalIncome, ...totalExpense]
            .slice(0, 5)
            .map((item) => (
              <CustomListItem
                key={item.id}
                title={item.title}
                amount={item.amount}
                type={item.type}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              />
            ))}
        </View>

        {/* 🔥 BOTTOM NAV */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "110%",
            flexDirection: "row",
            justifyContent: "space-around",
            paddingVertical: 10,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#eee",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <AntDesign name="home" size={26} color="#0A84FF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Add")}>
            <AntDesign name="plus" size={26} color="#0A84FF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AllTransaction")}
          >
            <FontAwesome name="list-alt" size={26} color="#0A84FF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔥 MODAL (IMPORTANT PART) */}
      <ModalActions
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onEdit={() => {
          setModalVisible(false);
          navigation.navigate("Update", { item: selectedItem });
        }}
        onDelete={async () => {
          try {
            const docRef = doc(db, "transactions", selectedItem.id);
            await deleteDoc(docRef);
            setModalVisible(false);
          } catch (error) {
            alert(error.message);
          }
        }}
      />
    </SafeAreaView>
  );
}