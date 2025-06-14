// React Native Frontend (App.js)
import DatePicker from 'react-date-picker'
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(new Date());
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const { token } = await response.json();
      await SecureStore.setItemAsync('user_token', token);
      
      // Now you can use this token for authenticated requests
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Name" onChangeText={setEmail} />
      <TextInput placeholder="Address" onChangeText={setEmail} />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <DatePicker onChange={setDob} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
