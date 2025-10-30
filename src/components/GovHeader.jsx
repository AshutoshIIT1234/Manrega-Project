import React from 'react';
import './GovHeader.css';

const GovHeader = ({ language }) => {
  const translations = {
    hi: {
      govName: 'भारत सरकार',
      ministry: 'ग्रामीण विकास मंत्रालय',
      scheme: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना',
      state: 'उत्तर प्रदेश'
    },
    en: {
      govName: 'Government of India',
      ministry: 'Ministry of Rural Development',
      scheme: 'Mahatma Gandhi National Rural Employment Guarantee Scheme',
      state: 'Uttar Pradesh'
    }
  };

  const t = translations[language];

  return (
    <header className="gov-header">
      <div className="gov-header-top">
        <div className="emblem-section">
          <div className="emblem">
            <div className="ashoka-chakra">☸</div>
          </div>
          <div className="gov-info">
            <h1 className="gov-name">{t.govName}</h1>
            <p className="ministry-name">{t.ministry}</p>
          </div>
        </div>
      </div>
      <div className="gov-header-bottom">
        <div className="scheme-info">
          <h2 className="scheme-name">{t.scheme}</h2>
          <p className="state-name">{t.state}</p>
        </div>
      </div>
      <div className="tricolor-bar">
        <div className="bar-saffron"></div>
        <div className="bar-white"></div>
        <div className="bar-green"></div>
      </div>
    </header>
  );
};

export default GovHeader;