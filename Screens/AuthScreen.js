import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../src/config'; // путь может отличаться

export default function AuthScreen({ navigation, setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Поля для входа
  const [loginOrEmail, setLoginOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Поля для регистрации
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if (isLogin) {
      // Валидация входа
      if (!loginOrEmail.trim() || !password.trim()) {
        Alert.alert('Ошибка', 'Введите логин/email и пароль');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: loginOrEmail, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || 'Ошибка входа');
        }
        // Сохраняем токен
        await AsyncStorage.setItem('access_token', data.access_token);
        setIsLoggedIn(true);
      } catch (error) {
        Alert.alert('Ошибка', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Валидация регистрации
      if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        Alert.alert('Ошибка', 'Заполните все поля');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Ошибка', 'Пароли не совпадают');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || 'Ошибка регистрации');
        }
        await AsyncStorage.setItem('access_token', data.access_token);
        setIsLoggedIn(true);
      } catch (error) {
        Alert.alert('Ошибка', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')} // замените на свой путь
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</Text>

        {/* Поля регистрации (видны только если не вход) */}
        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </>
        )}

        {/* Поле логин/email (только для входа) */}
        {isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Логин или Email"
            value={loginOrEmail}
            onChangeText={setLoginOrEmail}
            autoCapitalize="none"
          />
        )}

        {/* Поле пароля (общее) */}
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Подтверждение пароля (только для регистрации) */}
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Button
              title={isLogin ? 'Войти' : 'Зарегистрироваться'}
              onPress={handleSubmit}
            />
          )}
        </View>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin
              ? 'Нет аккаунта? Зарегистрироваться'
              : 'Уже есть аккаунт? Войти'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  buttonContainer: {
    marginVertical: 8,
  },
  switchText: {
    marginTop: 15,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});