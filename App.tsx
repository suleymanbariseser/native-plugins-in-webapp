import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import WebappView from './components/WebappView';

export default function App() {

  useEffect(() => {
    console.log('App is started');
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Web app view</Text>
      <WebappView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20
  },
});
