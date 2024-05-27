import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet, Easing, Platform, PixelRatio } from "react-native";
import { Marker } from "react-native-maps";
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  size?: number;
  markerColor?: string;
}

const CompassMarker: React.FC<Props> = ({ coordinate, size = 40, markerColor = "#4285F4" }) => {
  const rotationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const compassAnimation = Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 2000, // Shortened duration for quicker animation
        easing: Easing.linear, // Linear easing for consistent rotation speed
        useNativeDriver: true,
      })
    );

    compassAnimation.start();

    return () => {
      compassAnimation.stop();
    };
  }, []);

  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseInAnimation = Animated.timing(pulseAnimation, {
      toValue: 1.2,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    const pulseOutAnimation = Animated.timing(pulseAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    const pulseSequence = Animated.sequence([
      pulseInAnimation,
      pulseOutAnimation,
    ]);

    Animated.loop(pulseSequence).start();

    return () => {
      pulseSequence.stop();
    };
  }, []);

  const rotateStyle = {
    transform: [{
      rotate: rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      })
    }]
  };

  const pulseStyle = {
    transform: [{ scale: pulseAnimation }],
  };

  // Adjust the size of the marker container and compass icon based on the marker size
  const markerContainerStyle = {
    width: size + 10,
    height: size + 10,
  };

  // Calculate the appropriate icon size based on the device's screen density
  const iconSize = size * PixelRatio.getFontScale();

  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={[styles.markerContainer, markerContainerStyle]}>
        <Animated.View style={[styles.compass, rotateStyle, pulseStyle]}>
          <MaterialIcons name="location-pin" size={iconSize} color={markerColor} style={styles.icon} />
        </Animated.View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  compass: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 3.5,
    borderColor: "#fff",
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    transform: [{ translateY: -2 }],
  },
});

export default CompassMarker;
