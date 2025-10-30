import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDistrictPerformance, getDistrictByLocation, getAllDistricts } from './controllers.js';
// import { startDataSync } from './sync.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/districts', getAllDistricts);
app.get('/api/district/:districtCode', getDistrictPerformance);
app.post('/api/district/locate', getDistrictByLocation);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start background data sync
// startDataSync();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
