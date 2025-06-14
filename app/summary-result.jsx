

import { ScrollView, Text, Button } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function SummaryResultScreen() {
  const { summary } = useLocalSearchParams();

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Dr name
      </Text>
      
      <Text style={{ fontSize: 18 }}>{summary}</Text>

      <Button
        title="Back to Input"
        onPress={() => router.back()}
        style={{ marginTop: 20 }}
      />
      <Button
        title="Submit Form"
        onPress={() => router.push({pathname:'/submit-form', params: {summary: summary}})} // Assuming `voice-input.jsx`
      />
    </ScrollView>
  );
}

