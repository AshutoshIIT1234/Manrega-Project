import React from 'react';
import './LanguageToggle.css';

const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <div className="language-toggle">
      <button
        className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
        onClick={() => setLanguage('hi')}
        aria-label="Switch to Hindi"
      >
        हिंदी
      </button>
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        aria-label="Switch to English"
      >
        English
      </button>
    </div>
  );
};

export default LanguageToggle;