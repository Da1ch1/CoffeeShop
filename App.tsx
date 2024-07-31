// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { Login } from './screens/Login';
import TabLayout from './app/_layout'; // Asegúrate de que la ruta es correcta
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import 'react-native-reanimated';
import ModalScreen from './app/modal';
import { useColorScheme } from '@/components/useColorScheme';
import { CartProvider } from '@/app/context/CartContext'; // Asegúrate de que la ruta sea correcta

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

const Layout = () => {
  const { authState } = useAuth();
  const colorScheme = useColorScheme(); // Usa el hook para obtener el esquema de colores

  return (
    <CartProvider>
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        {authState.authenticated ? (
          <>
            <Stack.Screen
              name="Fresh Coffee"
              options={{ headerShown: false }}
              component={TabLayout}
            />
            <Stack.Screen
              name="modal"
              options={{ headerShown: false, presentation: 'modal' }}
              component={ModalScreen}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
  );
};
