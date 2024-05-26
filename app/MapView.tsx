import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { getData } from './getData';
import Foot from './Footer';
import CurrentLocationMarker from './CurrentLocationMarker';
import { watchUserLocation, UserLocation } from './getCurrentLocation';
import { Dimensions } from 'react-native';

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
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const mapRef = useRef<MapView>(null);
  const pointerPosition = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    const startWatchingLocation = async () => {
      await watchUserLocation((location) => {
        setUserLocation(location);
        if (mapRef.current) {
          const zoomLevel = 0.01; // Adjust this value as needed
          const region = {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: zoomLevel,
            longitudeDelta: zoomLevel * (Dimensions.get('window').width / Dimensions.get('window').height),
          };
          mapRef.current.animateToRegion(region);
        }
      });
    };
  
    startWatchingLocation();
  }, []);
  

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 11.570444,
          longitude: 104.905083,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {stations.map(station => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: parseFloat(station.latitude.toString()),
              longitude: parseFloat(station.longitude.toString()),
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
        
        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            centerOffset={{ x: 0, y: -500 }}
          >
            <CurrentLocationMarker coordinate={userLocation} />
          </Marker>
        )}
      </MapView>
      <Foot
        mapRef={mapRef}
        userLocation={userLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
