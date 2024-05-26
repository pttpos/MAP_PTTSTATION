import * as Location from "expo-location";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = async (): Promise<UserLocation | null> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access location was denied");
    return null;
  }

  let location = await Location.getLastKnownPositionAsync({});
  if (!location) {
    location = await Location.getCurrentPositionAsync({});
  }

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

export const watchUserLocation = async (
  callback: (location: UserLocation) => void
): Promise<void> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permission to access location was denied");
    return;
  }

  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 0,
    },
    (location) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  );
};
