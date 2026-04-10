import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import AddScreen from "./screens/AddScreen";
import AllTransaction from "./screens/AllTransaction";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UpdateScreen from "./screens/UpdateScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="AllTransaction" component={AllTransaction} />
        <Stack.Screen name="Update" component={UpdateScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}