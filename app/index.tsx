// App.tsx

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapViewComponent from './MapView';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Station Map</Text>
      <MapViewComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
