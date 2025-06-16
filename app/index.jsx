import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router'; // Import router for navigation
import Storage from './utils/storage.js';

export default function HomeScreen() {
  const [loggedIn, setLoggedIn] = useState(false); // Initialize loggedIn state
  const [isDoctor, setIsDoctor] = useState(false); // Initialize isDoctor state

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await Storage.getItem('user_token'); // Check if user_token exists
      setLoggedIn(!!token); // Set loggedIn based on token existence

      // Check if the user is a doctor
      const doctorStatus = sessionStorage.getItem('is_doctor'); // Get is_doctor from sessionStorage
      setIsDoctor(doctorStatus === 'true'); // Set isDoctor based on the value
    };

    checkLoginStatus(); // Call the function to check login status
  }, []); // Empty dependency array to run once on mount

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/AIHealthAssist.png')} 
        style={{ width: 200, height: 200 }}
      />
      {!loggedIn && (
        <>
          <Button
            title="Go to Sign In"
            onPress={() => router.push('/login')} // Assuming `voice-input.jsx`
          />
          <Button
            title="Go to Patient Sign Up"
            onPress={() => router.push('/signup')} // Assuming `voice-input.jsx`
          />
        </>
      )}
      {loggedIn && (
        <Button
          title="Go to Symptom Input"
          onPress={() => router.push('/voice-input')} // Assuming `voice-input.jsx`
        />
      )}
      {isDoctor && ( // Conditionally render the button for doctors
        <Button
          title="Go to Doctor Dashboard"
          onPress={() => router.push('/doctor-dashboard')} // Assuming a doctor dashboard route
        />
      )}
      {/* Add other buttons as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});



