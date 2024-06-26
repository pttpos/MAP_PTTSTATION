import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Modal,
  Linking,
  ScrollView,
  Button,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { getData } from "./getData";
import Foot from "./Footer";
import CurrentLocationMarker from "./CurrentLocationMarker";
import { UserLocation } from "./getCurrentLocation";
import * as Location from "expo-location";
import FilterForm from "./FilterForm";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
// import Block from "./Block";
// import LayoutMapToggle from "./LayoutMapToggle";
// import GoogleButton from "./GoogleButton";
// import BlockImage from "./BlockImage";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<Station | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number>(0);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");

  // Filter options
  const [Other_productOptions, setOther_ProductOptions] = useState<string[]>([]);
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [descriptionOptions, setDescriptionOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [titleOptions, setTitleOptions] = useState<string[]>([]);

  // Selected filter values
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedOtherProduct, setSelectedOtherProduct] = useState<string | null>(null);
  const [filteredMarkers, setFilteredMarkers] = useState<Station[]>([]);
  const pointerPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getData();
        setStations(data.STATION);
        setFilteredMarkers(data.STATION);

        // Extract unique values for filter options from fetched stations data
        const allOtherProducts = data.STATION.flatMap((station: Station) => station.other_product);
        const allProducts = data.STATION.flatMap((station: Station) => station.product);
        const allDescriptions = data.STATION.flatMap((station: Station) => station.description);
        const allServices = data.STATION.flatMap((station: Station) => station.service);
        const allProvinces = data.STATION.map((station: Station) => station.province);
        const allTitles = data.STATION.map((station: Station) => station.title);

        setProvinceOptions(Array.from(new Set(allProvinces)));
        setProductOptions(Array.from(new Set(allProducts)));
        setOther_ProductOptions(Array.from(new Set(allOtherProducts)));
        setDescriptionOptions(Array.from(new Set(allDescriptions)));
        setServiceOptions(Array.from(new Set(allServices)));
        setTitleOptions(Array.from(new Set(allTitles)));
      } catch (error) {
        console.error("Error fetching data:", error);
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

  const handleUserLocationChange = (location: { coords: { latitude: any; longitude: any; }; }) => {
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
      filtered = filtered.filter((station) => station.product.includes(selectedProduct));
    }
    if (selectedOtherProduct) {
      filtered = filtered.filter((station) => station.other_product.includes(selectedOtherProduct));
    }
    if (selectedDescription) {
      filtered = filtered.filter((station) => station.description.includes(selectedDescription));
    }

    if (selectedService) {
      filtered = filtered.filter((station) => station.service.includes(selectedService));
    }

    if (selectedProvince) {
      filtered = filtered.filter((station) => station.province === selectedProvince);
    }

    setFilteredMarkers(filtered);

    if (selectedTitle) {
      const selectedStation = filtered.find((station) => station.title === selectedTitle);
      if (selectedStation) {
        mapRef.current?.animateToRegion(
          {
            latitude: parseFloat(selectedStation.latitude.toString()),
            longitude: parseFloat(selectedStation.longitude.toString()),
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          },
          500
        );
      }
    } else {
      const filteredMarkersCoordinates = filtered.map((station) => ({
        latitude: parseFloat(station.latitude.toString()),
        longitude: parseFloat(station.longitude.toString()),
      }));
      const minLat = Math.min(...filteredMarkersCoordinates.map((coord) => coord.latitude));
      const maxLat = Math.max(...filteredMarkersCoordinates.map((coord) => coord.latitude));
      const minLon = Math.min(...filteredMarkersCoordinates.map((coord) => coord.longitude));
      const maxLon = Math.max(...filteredMarkersCoordinates.map((coord) => coord.longitude));

      const latitude = (minLat + maxLat) / 2;
      const longitude = (minLon + maxLon) / 2;
      const latitudeDelta = Math.abs(maxLat - minLat) * 1.2;
      const longitudeDelta = Math.abs(maxLon - minLon) * 1.2;

      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        },
        500
      );
    }

    setShowFilterForm(false);
  };

  useEffect(() => {
    if (!selectedProvince) {
      const allTitles = stations.flatMap((station) => station.title);
      const allOtherProducts = stations.flatMap((station) => station.other_product);
      const allDescriptions = stations.flatMap((station) => station.description);
      const allServices = stations.flatMap((station) => station.service);

      setTitleOptions(Array.from(new Set(allTitles)));
      setOther_ProductOptions(Array.from(new Set(allOtherProducts)));
      setDescriptionOptions(Array.from(new Set(allDescriptions)));
      setServiceOptions(Array.from(new Set(allServices)));
    } else {
      const filteredTitles = stations
        .filter((station) => station.province === selectedProvince)
        .flatMap((station) => station.title);
      setTitleOptions(Array.from(new Set(filteredTitles)));

      const filteredOtherProducts = stations
        .filter((station) => station.province === selectedProvince)
        .flatMap((station) => station.other_product);
      setOther_ProductOptions(Array.from(new Set(filteredOtherProducts)));

      const filteredDescriptions = stations
        .filter((station) => station.province === selectedProvince)
        .flatMap((station) => station.description);
      setDescriptionOptions(Array.from(new Set(filteredDescriptions)));

      const filteredServices = stations
        .filter((station) => station.province === selectedProvince)
        .flatMap((station) => station.service);
      setServiceOptions(Array.from(new Set(filteredServices)));
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

  const handleMarkerPress = (marker: Station) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    if (!selectedMarker) return null;

    return (
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{selectedMarker.title}</Text>
        <Text>{selectedMarker.address}</Text>
        <Image source={{ uri: selectedMarker.picture }} style={styles.modalImage} />
        <Text>Status: {selectedMarker.status}</Text>
        <Text>Products: {selectedMarker.product.join(", ")}</Text>
        <Text>Services: {selectedMarker.service.join(", ")}</Text>
        <Text>Promotion: {selectedMarker.promotion.join(", ")}</Text>
        <Button title="Close" onPress={() => setModalVisible(false)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        initialRegion={{
          latitude: 11.570444,
          longitude: 104.905083,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {filteredMarkers.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: parseFloat(station.latitude.toString()),
              longitude: parseFloat(station.longitude.toString()),
            }}
            title={station.title}
            description={station.address}
            onPress={() => handleMarkerPress(station)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.title}>{station.title}</Text>
                <Text>{station.address}</Text>
                <Image source={{ uri: station.picture }} style={styles.image} />
                <Text>Status: {station.status}</Text>
                <Text>Products: {station.product.join(", ")}</Text>
                <Text>Services: {station.service.join(", ")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            centerOffset={{ x: 0.5, y: 4 }}
          >
            <CurrentLocationMarker coordinate={userLocation} />
          </Marker>
        )}
      </MapView>
      <Foot setShowFilterForm={setShowFilterForm} mapRef={mapRef} userLocation={userLocation} />
      <FilterForm
        showFilterForm={showFilterForm}
        selectedProvince={selectedProvince}
        selectedTitle={selectedTitle}
        selectedProduct={selectedProduct}
        selectedOtherProduct={selectedOtherProduct}
        selectedDescription={selectedDescription}
        selectedService={selectedService}
        setSelectedProvince={setSelectedProvince}
        setSelectedTitle={setSelectedTitle}
        setSelectedProduct={setSelectedProduct}
        setSelectedOtherProduct={setSelectedOtherProduct}
        setSelectedDescription={setSelectedDescription}
        setSelectedService={setSelectedService}
        provinceOptions={provinceOptions}
        titleOptions={titleOptions}
        productOptions={productOptions}
        otherProductOptions={Other_productOptions}
        descriptionOptions={descriptionOptions}
        serviceOptions={serviceOptions}
        applyFilters={applyFilters}
        toggleFilterForm={() => setShowFilterForm(!showFilterForm)}
      />
      <Modal visible={modalVisible} animationType="slide">
        {renderModalContent()}
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    width: width,
    height: height,
    ...StyleSheet.absoluteFillObject,
  },
  callout: {
    width: 200,
  },
  title: {
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default MapViewComponent;
