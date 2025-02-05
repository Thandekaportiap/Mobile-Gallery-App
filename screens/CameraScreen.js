import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { insertImage, initializeDatabase } from "../utils/database";

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Request camera and location permissions
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(cameraStatus === "granted" && locationStatus === "granted");
    })();

    initializeDatabase(); // Ensure database table exists
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const location = await Location.getCurrentPositionAsync({});
        const timestamp = new Date().toISOString();

        // Save image metadata to SQLite
        await insertImage(photo.uri, location.coords.latitude, location.coords.longitude, timestamp);

        alert("Picture taken and saved!");
      } catch (error) {
        console.error("Error taking picture:", error);
        alert("Failed to take picture or save metadata.");
      }
    }
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View />; // Show a blank screen while permissions are being checked
  }
  if (hasPermission === false) {
    return <Text>No access to camera or location</Text>; // Handle denied permissions
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={styles.camera} type={cameraType}>
        <View style={styles.buttonContainer}>
          <Button title="Take Picture" onPress={takePicture} />
          <Button title="Switch Camera" onPress={switchCamera} />
          <Button title="View Gallery" onPress={() => navigation.navigate("Gallery")} />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },
});