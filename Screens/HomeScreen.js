import React from 'react';
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
import { useNavigation } from '@react-navigation/native'; // <-- импортируем хук

export default function HomeScreen({ setIsLoggedIn }) {
  const navigation = useNavigation(); // <-- получаем navigation

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.content} />

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => Alert.alert('Переход в личный кабинет')}
          >
            <Ionicons name="person-outline" size={28} color="white" />
            <Text style={styles.navText}>Профиль</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Camera')} // <-- теперь работает
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
  logoutButton: { position: 'absolute', top: 40, right: 20, zIndex: 10, padding: 8 },
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