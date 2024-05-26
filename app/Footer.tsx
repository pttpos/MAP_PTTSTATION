import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions, Animated } from "react-native";
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
    const [animation] = useState(new Animated.Value(0));

    const handleButtonAnimation = (toValue: number) => {
        Animated.timing(animation, {
            toValue,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleLocationButtonPress = async () => {
        try {
            const location = await getCurrentLocation();
            if (location && mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }
        } catch (error) {
            console.error('Error getting current location:', error);
        }
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity
                onPressIn={() => handleButtonAnimation(1)}
                onPressOut={() => handleButtonAnimation(0)}
                onPress={() => setShowFilterForm(true)}
                style={[styles.footerButton, { opacity: animation, backgroundColor: "#E5E5E5" }]}
            >
                <Ionicons name="options-outline" size={Dimensions.get('window').width * 0.06} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                onPressIn={() => handleButtonAnimation(1)}
                onPressOut={() => handleButtonAnimation(0)}
                onPress={() => handleLocationButtonPress()}
                style={[styles.footerButton, { opacity: animation, backgroundColor: "#E5E5E5" }]}
            >
                <Ionicons name="locate-outline" size={Dimensions.get('window').width * 0.06} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                onPressIn={() => handleButtonAnimation(1)}
                onPressOut={() => handleButtonAnimation(0)}
                onPress={() => console.log("Filter 2")}
                style={[styles.footerButton, { opacity: animation, backgroundColor: "#E5E5E5" }]}
            >
                <Ionicons name="options-outline" size={Dimensions.get('window').width * 0.06} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: Dimensions.get('window').width * 0.03,
        paddingVertical: Dimensions.get('window').height * 0.02,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    footerButton: {
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get('window').width * 0.12,
        height: Dimensions.get('window').width * 0.12,
        borderRadius: Dimensions.get('window').width * 0.06,
    },
});

export default Footer;
