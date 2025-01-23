// utils/database.js
import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('gallery.db', '1.0');

export const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === "web") {
        console.log("SQLite is not supported on web platform");
        return resolve();
      }
      
      db.transaction(tx => {
        // Users table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );`
        );

        // Images table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            uri TEXT NOT NULL,
            filename TEXT NOT NULL,
            latitude REAL,
            longitude REAL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
          );`
        );

        // Tags table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
          );`
        );

        // Image tags relation table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS image_tags (
            image_id INTEGER,
            tag_id INTEGER,
            FOREIGN KEY (image_id) REFERENCES images (id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
            PRIMARY KEY (image_id, tag_id)
          );`
        );
      },
      (error) => {
        console.error("Database creation error:", error);
        reject(error);
      },
      () => {
        console.log("Database initialized successfully");
        resolve();
      });
    } catch (error) {
      console.error("Database initialization error:", error);
      reject(error);
    }
  });
};

export const dbOperations = {
  createUser(email) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO users (email) VALUES (?)',
          [email],
          (_, result) => {
            resolve(result.insertId);
          },
          (_, error) => {
            console.error("Error creating user:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ?',
          [email],
          (_, { rows: { _array } }) => {
            resolve(_array[0]);
          },
          (_, error) => {
            console.error("Error getting user:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  },

  addImage(userId, { uri, filename, latitude, longitude, description }) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO images (user_id, uri, filename, latitude, longitude, description)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [userId, uri, filename, latitude, longitude, description],
          (_, result) => {
            resolve(result.insertId);
          },
          (_, error) => {
            console.error("Error adding image:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getImagesByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM images WHERE user_id = ? ORDER BY created_at DESC',
          [userId],
          (_, { rows: { _array } }) => {
            resolve(_array);
          },
          (_, error) => {
            console.error("Error getting images:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  }
};