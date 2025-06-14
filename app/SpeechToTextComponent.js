// SpeechToTextComponent.js
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { Audio } from 'expo-av'; // Corrected import

const BACKEND_TRANSCRIBE_URL = 'http://localhost:3000/transcribe';

const SpeechToTextComponent = ({ onTranscriptionComplete, onTranscriptionError }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [status, setStatus] = useState('Press Record to start speaking');

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setStatus('Recording... Tap to stop');
    } catch (err) {
      console.error('Recording failed:', err);
      Alert.alert(
        'Permission Required',
        'Please enable microphone access in Settings',
        [
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      onTranscriptionError('Recording permission needed');
    }
  };



  const stopRecording = async () => {
    setIsRecording(false);
    setStatus('Stopping recording...');
    try {
      if (!recording) return;
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setStatus('Processing audio...');
      await sendAudioForTranscription(uri);
    } catch (err) {
      console.error('Stop failed:', err);
      Alert.alert('Error', 'Failed to stop recording');
    } finally {
      setRecording(null);
    }
  };
  const sendAudioForTranscription = async (audioUri) => {
    setIsTranscribing(true);
    setStatus('Sending audio for transcription...');

    try {
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) {
        throw new Error('Audio file does not exist locally.');
      }

      const formData = new FormData();
      const fileName = `recording-${Date.now()}.m4a`;
      const fileType = 'audio/mp4';

      formData.append('audio', {
        uri: audioUri,
        name: fileName,
        type: fileType,
      });

      const response = await fetch(BACKEND_TRANSCRIBE_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Backend error: ${response.status} - ${errorData.error || 'Unknown error'}`
        );
      }

      const data = await response.json();
      setStatus('Transcription Complete!');
      onTranscriptionComplete(data.transcript);
    } catch (error) {
      console.error('Transcription error:', error);
      Alert.alert('Error', error.message || 'Transcription failed');
      setStatus('Transcription failed.');
      onTranscriptionError(error.message || 'Transcription failed.');
    } finally {
      setIsTranscribing(false);
      if (audioUri) {
        try {
          await FileSystem.deleteAsync(audioUri, { idempotent: true });
        } catch (deleteError) {
          console.error('Error deleting audio:', deleteError);
        }
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Speech Input</Text>
      <View style={styles.buttonRow}>
        {!isRecording ? (
          <Button
            title="Start Recording"
            onPress={startRecording}
            disabled={isTranscribing}
            color="#4CAF50"
          />
        ) : (
          <Button
            title="Stop Recording"
            onPress={stopRecording}
            disabled={isTranscribing}
            color="#F44336"
          />
        )}
      </View>
      <Text style={styles.statusText}>{status}</Text>
      {isTranscribing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Transcribing...</Text>
        </View>
      )}
    </View>
  );
};



// Keep the same StyleSheet as before
const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#eef',
    marginBottom: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
});

export default SpeechToTextComponent;


