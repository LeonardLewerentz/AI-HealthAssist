import * as SecureStore from 'expo-secure-store';
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
      const response = await fetch('http://localhost:3000/submitform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiSummary }),
      });
      if (response.ok) {
        router.replace('/success-screen');
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
        editable={false}  // Remove if you want user-editable
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


