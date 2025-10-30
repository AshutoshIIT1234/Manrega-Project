import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
try {
  await fs.access(DATA_DIR);
} catch {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

// Helper function to read JSON file
async function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`File ${filename} not found or invalid, returning empty array`);
    return [];
  }
}

// Helper function to write JSON file
async function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Database operations
export const jsonDb = {
  // Get all districts
  async getAllDistricts() {
    return await readJsonFile('districts.json');
  },

  // Get district by code
  async getDistrictByCode(districtCode) {
    const districts = await readJsonFile('districts.json');
    return districts.find(d => d.district_code === districtCode);
  },

  // Get district performance data
  async getDistrictPerformance(districtCode) {
    const performance = await readJsonFile('performance.json');
    return performance.filter(p => p.district_code === districtCode);
  },

  // Get district by location (simplified - you can enhance this)
  async getDistrictByLocation(latitude, longitude) {
    const districts = await readJsonFile('districts.json');
    // For now, return first district as a placeholder
    // You can implement proper geo-location logic here
    return districts[0] || null;
  },

  // Add/update districts
  async saveDistricts(districts) {
    await writeJsonFile('districts.json', districts);
  },

  // Add/update performance data
  async savePerformance(performance) {
    await writeJsonFile('performance.json', performance);
  },

  // Load data from your JSON files
  async loadDataFromJson(districtsData, performanceData) {
    if (districtsData) {
      await this.saveDistricts(districtsData);
    }
    if (performanceData) {
      await this.savePerformance(performanceData);
    }
  }
};

// Mock query function to replace pg query
export async function query(text, params) {
  console.log('Mock query executed:', { text, params });
  return { rows: [], rowCount: 0 };
}