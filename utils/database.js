import React, { useEffect, useState } from 'react';
import { SQLite } from 'expo-sqlite';

// Global variable for the database
let db;

export default function App() {
  const [dbReady, setDbReady] = useState(false); // State to track db initialization

  useEffect(() => {
    // Open the database
    db = SQLite.openDatabase("gallery.db");

    // Create table if it doesn't exist
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS images (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          uri TEXT NOT NULL, 
          latitude REAL, 
          longitude REAL, 
          timestamp TEXT
        );`,
        [],
        () => {
          console.log("Table created successfully");
          setDbReady(true); // Mark the DB as ready after initialization
        },
        (_, error) => {
          console.error("Error creating table", error);
          setDbReady(false); // Mark the DB as not ready if there's an error
        }
      );
    });
  }, []);

  return null;
}

// Insert an image into the database
export const insertImage = (uri, latitude, longitude, timestamp) => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }
  
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO images (uri, latitude, longitude, timestamp) VALUES (?, ?, ?, ?);",
      [uri, latitude, longitude, timestamp],
      (_, result) => console.log("Image inserted:", result),
      (_, error) => console.error("Error inserting image", error)
    );
  });
};

// Get all images from the database
export const getImages = (callback) => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM images;",
      [],
      (_, { rows: { _array } }) => callback(_array),
      (_, error) => console.error("Error fetching images", error)
    );
  });
};

// Delete an image from the database
export const deleteImage = (id) => {
  if (!db) {
    console.error("Database not initialized");
    return;
  }

  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM images WHERE id = ?;",
      [id],
      (_, result) => console.log("Image deleted:", result),
      (_, error) => console.error("Error deleting image", error)
    );
  });
};
