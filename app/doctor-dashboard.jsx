import { useState, useEffect } from 'react';
import { Image, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Storage from './utils/storage';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = await Storage.getItem('user_token');
        
        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch('http://localhost:3000/listsubmissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setError('Session expired - please login again');
          } else {
            setError('Failed to fetch cases');
          }
          return;
        }

        const data = await response.json();
        const sorted = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt));
        setCases(sorted);
      } catch (err) {
        setError('Network error - please try again');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <ScrollView style={styles.container}>
      {cases.map((caseItem) => (
        <Pressable 
          key={caseItem.id} 
          onPress={() => setExpandedId(expandedId === caseItem.id ? null : caseItem.id)}
          style={styles.card}
        >
          <Text style={styles.title}>{caseItem.patientName}</Text>
          
          {expandedId === caseItem.id && (
            <View style={styles.details}>
              <Text>DOB: {new Date(caseItem.patientDob).toLocaleDateString()}</Text>
              <Text>Address: {caseItem.patientAddress}</Text>
              <Text>AI Summary: {caseItem.aiSummary}</Text>
              <Text>Created: {new Date(caseItem.createdAt).toLocaleString()}</Text>
              <Text>Updated: {new Date(caseItem.updatedAt).toLocaleString()}</Text>
              <Image 
                source={{ uri: `http://localhost:3000/download?userid=${caseItem.patientId}` }} 
                style={{ width: 200, height: 200 }}
              />
            </View>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5
  },
  details: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
    marginTop: 10
  },
  error: {
    color: 'red',
    padding: 15,
    textAlign: 'center'
  }
});

export default CaseList;

