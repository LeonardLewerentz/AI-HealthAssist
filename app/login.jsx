// React Native Frontend (App.js or LoginScreen.js)
import Storage from './utils/storage'; // This is correct
import { useState } from 'react';
import { Button, TextInput, View, Text, Alert } from 'react-native'; // Added Text and Alert for better feedback
import { router } from 'expo-router'; // Import router for navigation

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://api.aihealthassist.leonardlewerentz.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle non-200 responses (e.g., 401 Unauthorized)
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        Alert.alert("Login Failed", errorData.message || "Invalid credentials.");
        console.error('Login response was not OK:', response.status, errorData);
        return; // Stop execution if login failed
      }

      const { token, isDoctor } = await response.json();

      // Fix: Use SecureStore.setItemAsync instead of setValueWithKeyAsync
      await Storage.setItem('user_token', token);
      await Storage.setItem('is_doctor', isDoctor)
      console.log('Token stored:', token);

      // Now you can use this token for authenticated requests
      router.push("/");
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert("Login Error", "An error occurred during login. Please try again later.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10, width: '80%' }}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, width: '80%' }}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
