import React, { useEffect } from 'react';
import { SQLite } from 'expo-sqlite';

export default function App() {
  useEffect(() => {
    const db = SQLite.openDatabase("gallery.db");

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
        () => console.log("Table created successfully"),
        (_, error) => console.error("Error creating table", error)
      );
    });
  }, []);

  return null;
}


export const insertImage = (uri, latitude, longitude, timestamp) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO images (uri, latitude, longitude, timestamp) VALUES (?, ?, ?, ?);",
      [uri, latitude, longitude, timestamp],
      (_, result) => console.log("Image inserted:", result),
      (_, error) => console.error("Error inserting image", error)
    );
  });
};

export const getImages = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM images;",
      [],
      (_, { rows: { _array } }) => callback(_array),
      (_, error) => console.error("Error fetching images", error)
    );
  });
};

export const deleteImage = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM images WHERE id = ?;",
      [id],
      (_, result) => console.log("Image deleted:", result),
      (_, error) => console.error("Error deleting image", error)
    );
  });
};
