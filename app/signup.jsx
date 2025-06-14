// React Native Frontend (App.js)
import DatePicker from 'react-date-picker';
import { useState } from 'react';
import { Button, TextInput, View, Modal, Text, Alert, Platform } from 'react-native';
import { router } from 'expo-router'; // Import router for navigation

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(new Date());
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const validateFields = () => {
    if (!email || !name || !address || !password || !dob) {
      const message = 'All fields must be filled out.';
      showAlertOrModal(message);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 255 || !emailRegex.test(email)) {
      const message = 'Please enter a valid email address under 255 characters.';
      showAlertOrModal(message);
      return false;
    }

    if (name.length < 2 || name.length > 255) {
      const message = 'Name must be between 2 and 255 characters.';
      showAlertOrModal(message);
      return false;
    }

    if (password.length < 8 || password.length > 100) {
      const message = 'Password must be between 8 and 100 characters.';
      showAlertOrModal(message);
      return false;
    }

    const today = new Date();
    if (dob >= today) {
      const message = 'Date of birth must be before the current date.';
      showAlertOrModal(message);
      return false;
    }

    return true;
  };

  const showAlertOrModal = (message) => {
    if (Platform.OS === 'web') {
      setModalMessage(message);
      setModalVisible(true);
    } else {
      Alert.alert('Validation Error', message);
    }
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return; // Stop if validation fails
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, dob, address, name }),
      });
      if (response.ok) {
        router.push("/");
      } else if (response.status === 409) {
        showAlertOrModal('User already exists.')
      } else {
        showAlertOrModal('Signup failed. Please try again later.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      showAlertOrModal('An error occurred. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Name" onChangeText={setName} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Address" onChangeText={setAddress} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={{ marginBottom: 10 }} />
      <DatePicker onChange={setDob} value={dob} />
      <Button title="Signup" onPress={handleLogin} />

      {/* Modal for validation messages */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text>{modalMessage}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SignupScreen;



