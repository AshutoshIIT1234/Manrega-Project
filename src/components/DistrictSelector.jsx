import React, { useState, useEffect } from 'react';
import { fetchDistricts } from '../utils/api';
import { getDistrictName, getStateName } from '../utils/districtTranslations';
import './DistrictSelector.css';

const translations = {
  hi: {
    title: 'अपना जिला चुनें',
    subtitle: 'मनरेगा प्रदर्शन देखने के लिए',
    search: 'जिला खोजें...',
    autoDetect: '📍 मेरा स्थान खोजें',
    loading: 'जिले लोड हो रहे हैं...'
  },
  en: {
    title: 'Select Your District',
    subtitle: 'To view MGNREGA performance',
    search: 'Search district...',
    autoDetect: '📍 Detect My Location',
    loading: 'Loading districts...'
  }
};

function DistrictSelector({ onSelect, language, onRetryLocation }) {
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    fetchDistricts()
      .then(data => setDistricts(data))
      .catch(err => console.error('Failed to load districts:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDistricts = districts.filter(d => {
    const displayName = getDistrictName(d.district_name, language);
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           d.district_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAutoDetect = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const response = await fetch('/api/district/locate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      });
      
      const district = await response.json();
      onSelect(district);
    } catch (err) {
      alert(language === 'hi' 
        ? 'स्थान का पता नहीं लगा सका। कृपया मैन्युअल रूप से चुनें।'
        : 'Could not detect location. Please select manually.');
    }
  };

  if (loading) {
    return <div className="selector-loading">{t.loading}</div>;
  }

  return (
    <div className="district-selector">
      <div className="selector-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      {onRetryLocation && (
        <button className="auto-detect-btn retry" onClick={onRetryLocation}>
          {language === 'hi' ? '📍 स्थान की अनुमति दें' : '📍 Allow Location Access'}
        </button>
      )}
      
      <button className="auto-detect-btn" onClick={handleAutoDetect}>
        {t.autoDetect}
      </button>

      <input
        type="text"
        className="search-input"
        placeholder={t.search}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="districts-grid">
        {filteredDistricts.map(district => (
          <div
            key={district.district_code}
            className="district-card"
            onClick={() => onSelect(district)}
          >
            <h3>{getDistrictName(district.district_name, language)}</h3>
            <p>{getStateName(district.state_name, language)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DistrictSelector;
