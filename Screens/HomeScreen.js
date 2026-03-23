import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../src/config';

export default function HomeScreen({ setIsLoggedIn }) {
  const navigation = useNavigation();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    fetchBalance();
  }, []);

useFocusEffect(
  useCallback(() => {
    fetchBalance();
  }, [])
);
  const fetchBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/users/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.balance}>💰 {balance !== null ? balance : '...'}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content} />

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={28} color="white" />
            <Text style={styles.navText}>Профиль</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Camera')}
          >
            <Ionicons name="camera-outline" size={28} color="white" />
            <Text style={styles.navText}>Камера</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => Alert.alert('Дополнительная кнопка')}
          >
            <Ionicons name="apps-outline" size={28} color="white" />
            <Text style={styles.navText}>Ещё</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutButton: { padding: 8 },
  content: { flex: 1 },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { color: 'white', fontSize: 12, marginTop: 4 },
});