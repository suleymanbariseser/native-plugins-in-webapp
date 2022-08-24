import { SafeAreaView, StyleSheet, Text } from 'react-native';
import WebappView from './components/WebappView';

export type Keys = 'STORAGE_READ' | 'STORAGE_WRITE' | 'SHARE';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
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
  },
});
