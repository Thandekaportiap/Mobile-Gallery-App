import React, { useState, useEffect } from "react";
import { View, FlatList, Image, StyleSheet, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getImages, deleteImage } from "../utils/database";

export default function GalleryScreen() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    refreshImages();
  }, []);

  const refreshImages = () => {
    getImages(setImages); // Fetch images from SQLite
  };

  const handleDelete = (id) => {
    deleteImage(id);
    refreshImages();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Text>Location: {item.latitude}, {item.longitude}</Text>
            <Text>Timestamp: {item.timestamp}</Text>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
      <MapView style={styles.map}>
        {images.map((image) => (
          <Marker
            key={image.id}
            coordinate={{
              latitude: image.latitude,
              longitude: image.longitude,
            }}
            title={`Image taken at ${image.timestamp}`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { margin: 10 },
  image: { width: 100, height: 100, marginBottom: 5 },
  map: { height: 300 },
});
