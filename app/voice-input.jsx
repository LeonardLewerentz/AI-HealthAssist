import React, { useState, useCallback } from 'react'; // Import useCallback
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router'; // Import router for navigation
import Storage from './utils/storage'

// Import the new SpeechToTextComponent
import SpeechToTextComponent from './SpeechToTextComponent'; // Adjust path as needed

async function callBackendForSummary(text, modelId, region = 'us-east-1') {
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

    const response = await fetch(`http://localhost:3000/summarize`, {
      // IMPORTANT: Adjust this URL to your backend server's actual IP/domain in production!
      // For development on a physical device, `localhost` will refer to the device itself.
      // Use your computer's local IP address (e.g., 'http://192.168.1.XX:3000') or ngrok.
      method: 'POST',
      headers: headers, // Use the prepared headers object
      body: JSON.stringify({
        text: text,
        modelId: modelId,
        region: region,
      }),
    });

    const data = await response.json();

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
        Alert.alert('Error', `Failed to get summary: ${errorMessage}`);
      }
      throw new Error(errorMessage);
    }

    return data.summary;
  } catch (error) {
    console.error('Error calling backend summary API:', error);
    // Be careful not to double-alert if an alert was already shown for 401/403
    if (!error.message.includes('No authentication token found.') && !error.message.includes('Session Expired')) {
        Alert.alert('Network Error', 'Could not connect to the summary service. Please try again.');
    }
    throw error;
  }
}

function SummaryScreen() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('anthropic.claude-v2');

  
  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // Ensure the modelId passed here is one your backend supports
      const generatedSummary = await callBackendForSummary(inputText, selectedModel, 'ap-southeast-2'); // Hardcoded region for summary, adjust as needed
      router.push({
        pathname: '/summary-result',
        params: { summary: generatedSummary }
      });
      // setSummary(generatedSummary);
    } catch (err) {
      setSummary('');
    } finally {
      setLoading(false);
    }
  };

  // Callback function to receive transcribed text
  const handleTranscriptionComplete = useCallback((transcribedText) => {
    console.log('Received transcribed text:', transcribedText);
    setInputText(prevText => (prevText ? prevText + '\n' : '') + transcribedText); // Append or set
    setError(''); // Clear any previous errors
  }, []);

  // Callback function for transcription errors (optional)
  const handleTranscriptionError = useCallback((errorMessage) => {
    console.error('Transcription component reported error:', errorMessage);
    setError(`Transcription Error: ${errorMessage}`);
  }, []);


  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Text Summarizer & Speech Input
      </Text>

      {/* NEW: Speech to Text Component */}
      <SpeechToTextComponent
        onTranscriptionComplete={handleTranscriptionComplete}
        onTranscriptionError={handleTranscriptionError}
      />

      <Text style={{ fontSize: 20, marginBottom: 10, marginTop: 20 }}>Text Input for Summary</Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          minHeight: 120, // Increased height
          textAlignVertical: 'top', // For multiline text input
        }}
        placeholder="Enter text to summarize or record speech above..."
        multiline
        value={inputText}
        onChangeText={setInputText}
      />

      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

      <Button title="Summarize" onPress={handleSummarize} disabled={loading} />

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      )}

      {summary ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Summary:</Text>
          <Text>{summary}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

export default SummaryScreen;









