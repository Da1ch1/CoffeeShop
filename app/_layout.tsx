// app/_layout.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './(tabs)';
import Productos from './(tabs)/productos';
import Pedidos from './(tabs)/pedidos';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Pressable } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // Importar FontAwesome desde @expo/vector-icons
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation

const Tab = createBottomTabNavigator();

const TabLayout: React.FC = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation(); // Obtén la instancia de navegación

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('modal')} // Usa navigation.navigate para abrir el modal
              style={{ marginRight: 15 }}
            >
              {({ pressed }) => (
                <FontAwesome
                  name="user-circle"
                  size={23}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Productos"
        component={Productos}
        options={{
          title: 'Productos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'fast-food' : 'fast-food-outline'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pedidos"
        component={Pedidos}
        options={{
          title: 'Carrito',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'receipt' : 'receipt-outline'} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
