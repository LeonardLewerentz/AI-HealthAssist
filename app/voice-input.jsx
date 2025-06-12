import { Picker } from '@react-native-picker/picker';

async function callBackendForSummary(text, modelId, region = 'us-east-1') {
  try {
    const response = await fetch(`http://localhost:3000/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        modelId: modelId,
        region: region, // Pass region if needed, defaults in backend if not present
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If the response status is not 2xx (e.g., 400, 500)
      const errorMessage = data.error || 'Unknown error occurred';
      Alert.alert('Error', `Failed to get summary: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    return data.summary; // The actual summary text
  } catch (error) {
    console.error('Error calling backend summary API:', error);
    // You might want to show a more user-friendly error in your UI
    Alert.alert('Network Error', 'Could not connect to the summary service. Please try again.');
    throw error; // Re-throw to propagate the error
  }
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';

function SummaryScreen() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('anthropic.claude-v2'); // Default model

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const generatedSummary = await callBackendForSummary(inputText, selectedModel, 'us-east-1');
      setSummary(generatedSummary);
    } catch (err) {
      // Error is already alerted by callBackendForSummary, just clear summary
      setSummary('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Text Summarizer</Text>

      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, minHeight: 100 }}
        placeholder="Enter text to summarize..."
        multiline
        value={inputText}
        onChangeText={setInputText}
      />

      <Picker
        selectedValue={selectedModel}
        onValueChange={(itemValue) => setSelectedModel(itemValue)}
        style={{ marginBottom: 10 }}
      >
        <Picker.Item label="Claude v2 (Anthropic)" value="anthropic.claude-v2" />
        <Picker.Item label="AI21 J2 Mid" value="ai21.j2-mid" />
        <Picker.Item label="Titan Text Express (Amazon)" value="amazon.titan-text-express-v1" />
      </Picker>

      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

      <Button
        title="Summarize"
        onPress={handleSummarize}
        disabled={loading}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

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


/*
export default function TranscribeScreen({ navigation }) {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    const result = await getSummary(text);
    setSummary(result);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        multiline
        placeholder="Paste or enter symptoms here..."
        value={text}
        onChangeText={setText}
        style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10, height: 100 }}
      />
      <Button title="Summarize" onPress={handleSummarize} />
      {summary ? <Text style={{ marginTop: 20 }}>Summary: {summary}</Text> : null}
    </View>
  );
}
*/
