import { jsonDb } from './json-db.js';
import fs from 'fs/promises';

// Function to load your JSON data into the system
export async function loadJsonData(districtsFile, performanceFile) {
  try {
    console.log('Loading JSON data...');
    
    // Load districts data
    if (districtsFile) {
      const districtsData = JSON.parse(await fs.readFile(districtsFile, 'utf8'));
      await jsonDb.saveDistricts(districtsData);
      console.log(`Loaded ${districtsData.length} districts`);
    }
    
    // Load performance data
    if (performanceFile) {
      const performanceData = JSON.parse(await fs.readFile(performanceFile, 'utf8'));
      await jsonDb.savePerformance(performanceData);
      console.log(`Loaded ${performanceData.length} performance records`);
    }
    
    console.log('Data loading completed successfully!');
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// If running this file directly
if (process.argv[1].endsWith('load-data.js')) {
  const districtsFile = process.argv[2];
  const performanceFile = process.argv[3];
  
  if (!districtsFile && !performanceFile) {
    console.log('Usage: node load-data.js [districts.json] [performance.json]');
    console.log('Example: node load-data.js ./my-districts.json ./my-performance.json');
    process.exit(1);
  }
  
  loadJsonData(districtsFile, performanceFile);
}