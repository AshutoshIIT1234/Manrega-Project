import { jsonDb } from './json-db.js';

export async function getAllDistricts(req, res) {
  try {
    const districts = await jsonDb.getAllDistricts();
    res.json(districts);
  } catch (err) {
    console.error('Error fetching districts:', err);
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
}

export async function getDistrictPerformance(req, res) {
  try {
    const { districtCode } = req.params;
    const { months = 12 } = req.query;
    
    const district = await jsonDb.getDistrictByCode(districtCode);
    
    if (!district) {
      return res.status(404).json({ error: 'District not found' });
    }
    
    const performance = await jsonDb.getDistrictPerformance(districtCode);
    
    // Sort and limit performance data
    const sortedPerformance = performance
      .sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1);
        const dateB = new Date(b.year, b.month - 1);
        return dateB - dateA;
      })
      .slice(0, parseInt(months));
    
    res.json({
      district,
      performance: sortedPerformance
    });
  } catch (err) {
    console.error('Error fetching performance:', err);
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
}

export async function getDistrictByLocation(req, res) {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    // Find nearest districts using distance calculation
    const districts = await jsonDb.getAllDistricts();
    
    if (districts.length === 0) {
      return res.status(404).json({ error: 'No districts available' });
    }
    
    // Calculate distances and find nearest districts
    const districtsWithDistance = districts.map(district => {
      const lat1 = parseFloat(latitude);
      const lon1 = parseFloat(longitude);
      const lat2 = parseFloat(district.latitude);
      const lon2 = parseFloat(district.longitude);
      
      // Haversine formula for accurate distance
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      return { ...district, distance: Math.round(distance * 100) / 100 };
    });
    
    // Sort by distance
    const sortedDistricts = districtsWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Get the nearest district
    const nearest = sortedDistricts[0];
    
    // If the nearest district is very close (within 50km), return it directly
    if (nearest.distance <= 50) {
      res.json({
        ...nearest,
        confidence: 'high',
        alternatives: sortedDistricts.slice(1, 4).filter(d => d.distance <= 100)
      });
    } else {
      // If farther, provide multiple options
      res.json({
        ...nearest,
        confidence: 'low',
        message: `Nearest district is ${nearest.distance}km away. Please verify.`,
        alternatives: sortedDistricts.slice(1, 6).filter(d => d.distance <= 200)
      });
    }
  } catch (err) {
    console.error('Error locating district:', err);
    res.status(500).json({ error: 'Failed to locate district' });
  }
}
