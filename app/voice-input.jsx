import React, { useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { getSummary } from './services/bedrock';

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

