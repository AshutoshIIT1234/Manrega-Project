import React, { useState } from 'react';
import './LocationPermission.css';

const LocationPermission = ({ onLocationDetected, onSkip, language }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const translations = {
    hi: {
      title: '📍 अपना स्थान खोजें',
      subtitle: 'हम आपके नजदीकी जिले का डेटा दिखाने के लिए आपका स्थान जानना चाहते हैं',
      detectBtn: 'मेरा स्थान खोजें',
      skipBtn: 'छोड़ें, मैं खुद चुनूंगा',
      detecting: 'स्थान खोजा जा रहा है...',
      benefits: [
        '🎯 आपके जिले का तुरंत डेटा',
        '📊 स्थानीय MGNREGA प्रदर्शन',
        '⚡ तेज़ और सटीक जानकारी'
      ],
      privacy: '🔒 आपकी निजता सुरक्षित है - हम केवल जिला खोजने के लिए स्थान का उपयोग करते हैं'
    },
    en: {
      title: '📍 Find Your Location',
      subtitle: 'We would like to know your location to show data for your nearest district',
      detectBtn: 'Detect My Location',
      skipBtn: 'Skip, I\'ll choose manually',
      detecting: 'Detecting location...',
      benefits: [
        '🎯 Instant data for your district',
        '📊 Local MGNREGA performance',
        '⚡ Fast and accurate information'
      ],
      privacy: '🔒 Your privacy is safe - we only use location to find your district'
    }
  };

  const t = translations[language];

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setError('');
    setProgress('');

    try {
      const { detectDistrict } = await import('../utils/location');
      
      const district = await detectDistrict((progressMsg) => {
        setProgress(progressMsg);
      });

      if (district) {
        onLocationDetected(district);
      }
    } catch (err) {
      setError(err.message);
      setIsDetecting(false);
    }
  };

  return (
    <div className="location-permission">
      <div className="location-card">
        <div className="location-header">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="location-benefits">
          {t.benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              {benefit}
            </div>
          ))}
        </div>

        <div className="location-actions">
          <button 
            className="detect-btn"
            onClick={handleDetectLocation}
            disabled={isDetecting}
          >
            {isDetecting ? t.detecting : t.detectBtn}
          </button>
          
          <button 
            className="skip-btn"
            onClick={onSkip}
            disabled={isDetecting}
          >
            {t.skipBtn}
          </button>
        </div>

        {progress && (
          <div className="progress-message">
            {progress}
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
            <button 
              className="retry-btn"
              onClick={handleDetectLocation}
            >
              {language === 'hi' ? 'फिर कोशिश करें' : 'Try Again'}
            </button>
          </div>
        )}

        <div className="privacy-note">
          {t.privacy}
        </div>
      </div>
    </div>
  );
};

export default LocationPermission;