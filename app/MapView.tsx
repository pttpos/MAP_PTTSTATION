import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity, Dimensions, Linking } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { getData } from './getData';
import Foot from './Footer';
import CurrentLocationMarker from './CurrentLocationMarker';
import { UserLocation } from './getCurrentLocation';
import * as Location from "expo-location";
import RNPickerSelect from 'react-native-picker-select';



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
  const [showFilterForm, setShowFilterForm] = useState(false);

  // Filter options
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [descriptionOptions, setDescriptionOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [titleOptions, setTitleOptions] = useState<string[]>([]);

  // Selected filter values
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");

  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<number>(0);
  const [mapType, setMapType] = React.useState<'standard' | 'satellite'>('standard');
  const [filteredMarkers, setFilteredMarkers] = useState<any[]>([]);
  const pointerPosition = useRef(new Animated.Value(0)).current;

  // Fetching stations and watching location
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getData();
        setStations(data.STATION);
  
        // Extract unique values for filter options from fetched stations data
        const allProducts = data.STATION.flatMap((station: { product: any; }) => station.product);
        const allDescriptions = data.STATION.flatMap((station: { description: any; }) => station.description);
        const allServices = data.STATION.flatMap((station: { service: any; }) => station.service);
        const allProvinces = data.STATION.map((station: { province: any; }) => station.province);
        const allTitles = data.STATION.map((station: { title: any; }) => station.title);
  
        setProvinceOptions(Array.from(new Set(allProvinces)));
        setProductOptions(Array.from(new Set(allProducts)));
        setDescriptionOptions(Array.from(new Set(allDescriptions)));
        setServiceOptions(Array.from(new Set(allServices)));
        setTitleOptions(Array.from(new Set(allTitles)));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStations();
    
    const startWatchingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getLastKnownPositionAsync({});
      if (!location) {
        location = await Location.getCurrentPositionAsync({});
      }

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(newRegion, 500);
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 0,
        },
        handleUserLocationChange
      );
    };

    startWatchingLocation();
  }, []);

  const handleUserLocationChange = (location: {
    coords: { latitude: any; longitude: any };
  }) => {
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    Animated.timing(pointerPosition, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const applyFilters = () => {
    let filtered = stations;
  
    if (selectedProduct) {
      filtered = filtered.filter((station) =>
        station.product.includes(selectedProduct)
      );
    }
  
    if (selectedDescription) {
      filtered = filtered.filter((station) =>
        station.description.includes(selectedDescription)
      );
    }
  
    if (selectedService) {
      filtered = filtered.filter((station) =>
        station.service.includes(selectedService)
      );
    }
  
    if (selectedProvince) {
      // Zoom in on the selected province
      const stationsInProvince = stations.filter(
        (station) => station.province === selectedProvince
      );
      if (stationsInProvince.length > 0) {
        const coordinates = stationsInProvince.map((station) => ({
          latitude: station.latitude,
          longitude: station.longitude,
        }));
        const minLatitude = Math.min(
          ...coordinates.map((coord) => coord.latitude)
        );
        const maxLatitude = Math.max(
          ...coordinates.map((coord) => coord.latitude)
        );
        const minLongitude = Math.min(
          ...coordinates.map((coord) => coord.longitude)
        );
        const maxLongitude = Math.max(
          ...coordinates.map((coord) => coord.longitude)
        );
  
        const region = {
          latitude: (minLatitude + maxLatitude) / 2,
          longitude: (minLongitude + maxLongitude) / 2,
          latitudeDelta: maxLatitude - minLatitude + 1.1,
          longitudeDelta: maxLongitude - minLongitude + 1.1,
        };
  
        mapRef.current?.animateToRegion(region, 500);
      }
    }
  
    setFilteredMarkers(filtered);
    setShowFilterForm(false);
  };
  
  // Handling title selection
  const handleTitleSelection = (title: string) => {
    const stationWithTitle = stations.find((station) => station.title === title);
    if (stationWithTitle) {
      const provinceOfTitle = stationWithTitle.province;
      const stationInProvince = stations.find(
        (station) => station.province === provinceOfTitle
      );
      if (stationInProvince) {
        mapRef.current?.animateToRegion(
          {
            latitude: stationInProvince.latitude,
            longitude: stationInProvince.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          500
        );
      }
    }
  };

  useEffect(() => {
    if (selectedProvince) {
      const filteredTitles = stations
        .filter((station) => station.province === selectedProvince)
        .map((station) => station.title);
      setTitleOptions(Array.from(new Set(filteredTitles)));
    } else {
      setTitleOptions([]);
    }
  }, [selectedProvince]);

  const updateTitleOptions = (selectedProvince: string) => {
    const filteredTitles = stations
      .filter((station) => station.province === selectedProvince)
      .flatMap((station) => station.title);
    const uniqueTitles = Array.from(new Set(filteredTitles));
    setTitleOptions(uniqueTitles);
  };

  useEffect(() => {
    if (selectedProvince) {
      updateTitleOptions(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedTitle && selectedMarker) {
      const { latitude, longitude } = selectedMarker;
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500
      );
    }
  }, [selectedTitle]);

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
            centerOffset={{ x: 0, y: 100 }}
          >
            <CurrentLocationMarker coordinate={userLocation} />
          </Marker>
        )}
      </MapView>
      <Foot
        setShowFilterForm={setShowFilterForm}
        mapRef={mapRef}
        userLocation={userLocation}
      />
       {showFilterForm && (
        <View style={styles.filterContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Province:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Province", value: null }}
              value={selectedProvince}
              onValueChange={(value) => setSelectedProvince(value)}
              items={provinceOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Title:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Title", value: null }}
              value={selectedTitle}
              onValueChange={(value) => {
                setSelectedTitle(value);
                handleTitleSelection(value);
              }}
              items={titleOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Product:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Product", value: null }}
              value={selectedProduct}
              onValueChange={(value) => setSelectedProduct(value)}
              items={productOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Description:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Description", value: null }}
              value={selectedDescription}
              onValueChange={(value) => setSelectedDescription(value)}
              items={descriptionOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Service:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Service", value: null }}
              value={selectedService}
              onValueChange={(value) => setSelectedService(value)}
              items={serviceOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
            <Text style={styles.filterButtonText}>Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterCloseButton}
            onPress={() => setShowFilterForm(false)}
          >
            <Text style={styles.filterButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

function openGoogleMaps(lat: number, lon: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  Linking.openURL(url);
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    padding: 8,
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    padding: 8,
  },
});
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  customImageStyle: {
    width: width * 0.9, // Adjust width to 80% of screen width
    height: height * 0.18, // Adjust height to 30% of screen height
    borderRadius: 0.05 * Math.min(width, height), // Adjust borderRadius relative to the smaller of width and height
    position: "relative",
  },
  imageContainer: {
    position: "relative",
  },
  logoAndButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logoAndCloseContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 45,
  },
  markerImage: {
    width: 40,
    height: 45,
    resizeMode: "contain",
  },
  mapButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 50,
    backgroundColor: "rgba(255, 255, 255, 1)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerButton: {
    marginBottom: 60,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: "30%", // Adjust as needed
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  headerImage: {
    width: "30%", // Adjust as needed
    aspectRatio: 2.5, // Ensure the aspect ratio remains square
    resizeMode: "contain", // Use 'contain' to maintain the image's aspect ratio and fit within the specified width and height
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  blocksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  block: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  selectedBlock: {
    borderBottomColor: "#4287f5",
  },
  blockText: {
    fontSize: 16,
  },
  blockContent: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filterCloseButton: {
    marginTop: 20,
    alignSelf: "flex-end",
    backgroundColor: "#4287f5",
    borderRadius: 20,
    padding: 5,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  filterPicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  // Add blockTitle style here
  blockTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  productImage: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    borderRadius: 25, // Make the image round
    marginRight: 50, // Add space between product images
    marginBottom: 5,

  },
  Other_productImage: {
    width: 70, // Adjust the width as needed
    height: 70, // Adjust the height as needed
    marginRight: 10, // Add space between product images
    marginBottom: 5,
    resizeMode: 'contain', // Fit image within the container without cropping
  },

});

export default MapViewComponent;

