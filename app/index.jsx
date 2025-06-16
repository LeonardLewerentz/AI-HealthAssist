

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
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/AIHealthAssist.png')} 
          style={styles.logo}
        />
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        {!loggedIn && (
          <>
            <View style={styles.buttonWrapper}>
              <Button
                title="Go to Sign In"
                onPress={() => router.push('/login')}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="Go to Patient Sign Up"
                onPress={() => router.push('/signup')}
              />
            </View>
          </>
        )}
        {loggedIn && (
          <View style={styles.buttonWrapper}>
            <Button
              title="Go to Symptom Input"
              onPress={() => router.push('/voice-input')}
            />
          </View>
        )}
        {isDoctor && (
          <View style={styles.buttonWrapper}>
            <Button
              title="Go to Doctor Dashboard"
              onPress={() => router.push('/doctor-dashboard')}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 50, // Adjust this value as needed
  },
  buttonContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonWrapper: {
    width: '80%',
    marginVertical: 10,
  },
});


