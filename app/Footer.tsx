import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserLocation, getCurrentLocation } from './getCurrentLocation';
import MapView from "react-native-maps";

interface FooterProps {
    setShowFilterForm: React.Dispatch<React.SetStateAction<boolean>>;
    mapRef: React.RefObject<MapView>;
    userLocation: UserLocation | null;
}

const Footer: React.FC<FooterProps> = ({
    setShowFilterForm,
    mapRef,
    userLocation,
}) => {
    const animation = useRef(new Animated.Value(0)).current;

    const handleButtonPress = (action: "filter" | "location" | "filter2") => {
        if (action === "filter") {
            setShowFilterForm(true);
        } else if (action === "location") {
            if (mapRef.current && userLocation) {
                mapRef.current.animateToRegion(
                    {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    },
                    1000 as any
                );
                
            }
        } else {
            console.log("Filter 2");
        }
    };

    const handleButtonAnimation = (toValue: number) => {
        Animated.timing(animation, {
            toValue,
            duration: 200,
            useNativeDriver: false,
            easing: Easing.linear,
        }).start();
    };

    const renderButton = (action: "filter" | "location" | "filter2", iconName: "options-outline" | "locate-outline") => (
        <TouchableOpacity
            onPressIn={() => handleButtonAnimation(1)}
            onPressOut={() => handleButtonAnimation(0)}
            onPress={() => handleButtonPress(action)}
            style={[styles.footerButton, { opacity: animation, backgroundColor: "#0061ff" }]}
        >
            <Ionicons name={iconName} size={Dimensions.get('window').width * 0.06} color="black" />
        </TouchableOpacity>
    );
    

    return (
        <View style={styles.footer}>
            {renderButton("filter", "options-outline")}
            {renderButton("location", "locate-outline")}
            {renderButton("filter2", "options-outline")}
        </View>
    );
};


import { Platform } from 'react-native';

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: Dimensions.get('window').width * 0.03,
        paddingVertical: Platform.select({
            ios: Dimensions.get('window').height * 0.02, // Adjust for iOS
            android: Dimensions.get('window').height * 0.01, // Adjust for Android
        }),
        backgroundColor: "rgba(255, 255, 255, 0)",
        position: "absolute",
        bottom: 5,
        left: 0,
        right: 0,
    },
    footerButton: {
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get('window').width * 0.12,
        height: Dimensions.get('window').width * 0.12,
        borderRadius: Dimensions.get('window').width * 0.06,
        // Shadow for iOS
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
          },
          // Elevation for Android
          android: {
            elevation: 4,
          },
        }),
      },
});

export default Footer;
