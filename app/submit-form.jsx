import Storage from './utils/storage'
import { useState, useEffect } from 'react';  // Add useEffect
import { Button, TextInput, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const LoginScreen = () => {
  const [aiSummary, setAiSummary] = useState('');
  const params = useLocalSearchParams();  // Get router params

  // Set initial value from router params or API
  useEffect(() => {
    setAiSummary(params.summary);
  }, []);

  const handleSubmit = async () => {
    try {
      // 1. Retrieve the JWT token from storage
      const token = await Storage.getItem('user_token');

      // 2. Check if a token exists
    
      if (!token) {
        // Handle the case where no token is found (user not logged in)
        Alert.alert('Authentication Required', 'Please log in to access this feature.');
        // You might also want to redirect to the login screen here
        // router.push("/login"); // If using expo-router
        throw new Error('No authentication token found.');
      }

      // 3. Prepare headers, including the Authorization header
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Add the JWT token here
      };
      const response = await fetch('http://localhost:3000/submitform', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ aiSummary }),
      });
      if (response.ok) {
        router.replace('/success-screen');
      }
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Unknown error occurred'; // Backend might send 'message' or 'error'
      // Handle specific HTTP status codes
        if (response.status === 401 || response.status === 403) {
          Alert.alert('Session Expired', 'Please log in again.', [
              { text: 'OK', onPress: () => {
                  // Clear token and redirect to login
                  Storage.removeItem('user_token');
                  // router.push("/login"); // Uncomment if using expo-router for navigation
              }}
          ]);
        } else {
          Alert.alert('Error', `Failed to submit: ${errorMessage}`);
        }
      throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="AI Summary"
        value={aiSummary}
        onChangeText={setAiSummary}
        multiline
        style={{
          borderWidth: 1,
          padding: 10,
          minHeight: 200
        }}
      />
      
      <Button
        title="Submit Summary"
        onPress={handleSubmit}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default LoginScreen;


