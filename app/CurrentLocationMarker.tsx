import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  size?: number;
  markerColor?: string;
  pulseColor?: string;
}

const CurrentLocationMarker: React.FC<Props> = ({ coordinate, size = 20, markerColor = "red", pulseColor = "red" }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const opacityAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    opacityAnimation.start();
  }, []);

  return (
    <Marker coordinate={coordinate}>
      <View style={styles.markerContainer}>
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
              width: size * 2,
              height: size * 2,
              borderRadius: size,
              backgroundColor: pulseColor,
            },
          ]}
        />
        <MaterialCommunityIcons name="map-marker-radius" size={size} color={markerColor} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
  },
});

export default CurrentLocationMarker;
