// src/getData.ts

export const getData = () => {
    try {
      const data = require('../assets/data/markers.json');
    
      return data;
    } catch (error) {
      console.error('Error loading local JSON data:', error);
      throw error;
    }
  };
  