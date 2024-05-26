// src/MapView.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { getData } from './getData';

interface Station {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  description: string[];
  product: string[];
  other_product: string[];
  service: string[];
  province: string;
  address: string;
  status: string;
  promotion: string[];
  old_picture: string;
  picture: string;
}

const MapViewComponent: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getData();
        setStations(data.STATION);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchStations();
  }, []);

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 11.570444,
        longitude: 104.905083,
        latitudeDelta: 5, // Adjusted delta for a wider view
        longitudeDelta: 5, // Adjusted delta for a wider view
      }}
    >
      {stations.map(station => (
        <Marker
          key={station.id}
          coordinate={{
            latitude: parseFloat(station.latitude.toString()), // Convert latitude to number
            longitude: parseFloat(station.longitude.toString()), // Convert longitude to number
          }}
          title={station.title}
          description={station.address}
        >
          <Callout>
            <View style={styles.callout}>
              <Text style={styles.title}>{station.title}</Text>
              <Text>{station.address}</Text>
              <Image source={{ uri: station.picture }} style={styles.image} />
              <Text>Status: {station.status}</Text>
              <Text>Products: {station.product.join(', ')}</Text>
              <Text>Services: {station.service.join(', ')}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  callout: {
    width: 200,
  },
  title: {
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default MapViewComponent;
