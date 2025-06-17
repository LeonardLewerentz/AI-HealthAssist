import DatePicker from 'react-date-picker';
import { useState } from 'react';
import { StyleSheet, Button, TextInput, View, Modal, Text, Alert, Platform } from 'react-native';
import { router } from 'expo-router'; // Import router for navigation
import * as DocumentPicker from 'expo-document-picker'; // Import Expo DocumentPicker

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(new Date());
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [file, setFile] = useState(null); // State to hold the selected file

  const validateFields = () => {
    console.log('Current file state:', file); // Verify file exists
    if (!file) {
      showAlertOrModal('No file selected');
      return false;
    }

    if (!email || !name || !address || !password || !dob || !file) {
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

  
  // Add these styles:
  const styles = StyleSheet.create({
    dateContainer: {
      marginBottom: 20,
      zIndex: 1, // Ensures date picker appears above other elements
    },
    datePicker: {
      width: '100%',
      minWidth: 300,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: Platform.select({
        ios: 14,
        android: 10,
        default: 12
      }),
      backgroundColor: '#fff',
      height: Platform.select({
        ios: 44,
        default: 40
      }),
    },
    // Add to your existing button styles
    buttonContainer: {
      marginTop: 20,
      gap: 12,
    }
  });
    const showAlertOrModal = (message) => {
    if (Platform.OS === 'web') {
      setModalMessage(message);
      setModalVisible(true);
    } else {
      Alert.alert('Validation Error', message);
    }
  };
 
  const handleFileUpload = async () => {
    try {
      console.log('Starting file picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false
      });
      console.log('Picker result:', result);

        console.log('Success result assets:', result.assets);
        
        if (result.assets?.length > 0) {
        const asset = result.assets[0];
        console.log('Asset details:', asset);

        // Web-specific handling
        if (Platform.OS === 'web' && asset.uri.startsWith('data:')) {
          console.log('Processing web file...');
          const response = await fetch(asset.uri);
          asset.file = await response.blob();
          asset.name = asset.name || `file-${Date.now()}`;
          console.log('Processed web file:', asset);
        }

        setFile(asset);
        console.log('File state should update now');
      } else {
        console.warn('Empty assets array');
      }
    } catch (error) {
      console.error('File picker error:', error);
    }
  };

 
  const handleLogin = async () => {
    if (!validateFields()) {
      return; // Stop if validation fails
    }

    try {
      const response = await fetch('https://api.aihealthassist.leonardlewerentz.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, dob, address, name, file:file.uri }),
      });
      if (response.ok) {
        router.push("/");
      } else if (response.status === 409) {
        showAlertOrModal('User already exists.');
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
      <View style={styles.dateContainer}>
        <DatePicker
          onChange={setDob}
          value={dob}
          style={styles.datePicker}
          calendarIconColor="#007AFF"
          clearIconColor="#FF3B30"
          format="yyyy-MM-dd"
          minDate={new Date(1900, 0, 1)}
          maxDate={new Date()}
       />
      </View>
      <View style={styles.buttonContainer}> 
        {/* Button to upload a file */}
        <Button title="Upload File" onPress={handleFileUpload} />
        {file && <Text style={{ marginVertical: 10 }}>Selected File: {file.name}</Text>}

        <Button title="Signup" onPress={handleLogin} />
      </View>
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

