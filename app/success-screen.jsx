import { Button, View, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const SuccessScreen = () => {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text> Success! </Text>      
      <Button
        title="Return"
        onPress={ () => router.push("/voice-input") }
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default SuccessScreen;


