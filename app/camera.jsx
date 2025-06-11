import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeSkinCondition } from './services/rekognition';

export default function CameraScreen() {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({ base64: true });
    if (!result.cancelled) {
      setImage(result.uri);
      const tags = await analyzeSkinCondition(result.base64);
      setAnalysis(tags.join(', '));
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <Button title="Take a Photo" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 20 }} />}
      {analysis && <Text>Detected: {analysis}</Text>}
    </View>
  );
}

