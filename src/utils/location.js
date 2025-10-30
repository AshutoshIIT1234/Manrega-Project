// Location utility for detecting user's district
export const detectDistrict = async (onProgress) => {
  try {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    // Update progress
    if (onProgress) onProgress('Requesting location permission...');

    // Get user's position with better accuracy settings
    const position = await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 3;
      
      const tryGetPosition = () => {
        attempts++;
        
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            // Check accuracy - if too low, try again with different settings
            if (pos.coords.accuracy > 1000 && attempts < maxAttempts) {
              if (onProgress) onProgress(`Low accuracy (${Math.round(pos.coords.accuracy)}m), retrying...`);
              setTimeout(tryGetPosition, 1000);
              return;
            }
            resolve(pos);
          },
          (error) => {
            if (attempts < maxAttempts) {
              if (onProgress) onProgress(`Attempt ${attempts} failed, retrying...`);
              setTimeout(tryGetPosition, 2000);
              return;
            }
            
            let errorMessage = 'Location access failed';
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied by user';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out';
                break;
            }
            reject(new Error(errorMessage));
          }, 
          {
            timeout: attempts === 1 ? 20000 : 10000, // Longer timeout for first attempt
            enableHighAccuracy: attempts <= 2, // High accuracy for first 2 attempts
            maximumAge: attempts === 1 ? 0 : 60000 // Fresh location for first attempt
          }
        );
      };
      
      tryGetPosition();
    });

    const { latitude, longitude } = position.coords;
    
    // Update progress
    if (onProgress) onProgress(`Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

    // Call your API to get district based on coordinates
    if (onProgress) onProgress('Finding nearest district...');
    
    const { detectDistrictByLocation } = await import('./api');
    const district = await detectDistrictByLocation(latitude, longitude);
    
    if (!district) {
      throw new Error('No district found for your location');
    }

    if (onProgress) onProgress(`Found: ${district.district_name}`);
    
    return {
      ...district,
      detected_coordinates: { latitude, longitude },
      detection_accuracy: Math.round(position.coords.accuracy),
      location_method: position.coords.accuracy < 100 ? 'GPS' : 'Network'
    };

  } catch (error) {
    console.error('District detection failed:', error);
    if (onProgress) onProgress(`Error: ${error.message}`);
    throw error;
  }
};

// Utility to get user's approximate location name
export const getLocationName = async (latitude, longitude) => {
  try {
    // You can use a reverse geocoding service here
    // For now, returning coordinates
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Failed to get location name:', error);
    return 'Unknown location';
  }
};