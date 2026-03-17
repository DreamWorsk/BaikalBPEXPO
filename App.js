import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthScreen from './Screens/AuthScreen';
import HomeScreen from './Screens/HomeScreen';
import CameraScreen from './Screens/CameraScreen'; // <-- импортируем

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('access_token');
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return null; // можно заменить на сплеш-экран
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          // Несколько экранов для авторизованного пользователя
          <>
            <Stack.Screen name="Home">
              {props => <HomeScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Camera" component={CameraScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth">
            {props => <AuthScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}