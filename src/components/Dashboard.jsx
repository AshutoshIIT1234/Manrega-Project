import React, { useState, useEffect } from 'react';
import { fetchDistrictPerformance } from '../utils/api';
import { getDistrictName } from '../utils/districtTranslations';
import MetricCard from './MetricCard';
import PerformanceChart from './PerformanceChart';
import './Dashboard.css';

const translations = {
  hi: {
    back: '← वापस जाएं',
    autoDetected: '📍 आपका स्थान',
    loading: 'डेटा लोड हो रहा है...',
    currentMonth: 'इस महीने का प्रदर्शन',
    households: 'परिवार',
    householdsWorked: 'काम किया',
    persondays: 'व्यक्ति-दिवस',
    womenWork: 'महिला कार्य',
    expenditure: 'खर्च',
    avgWage: 'औसत मजदूरी',
    works: 'कार्य',
    completed: 'पूर्ण',
    ongoing: 'चल रहे',
    trend: 'पिछले महीनों का रुझान',
    registered: 'पंजीकृत',
    perDay: 'प्रति दिन',
    crore: 'करोड़',
    lakh: 'लाख'
  },
  en: {
    back: '← Go Back',
    autoDetected: '📍 Your Location',
    loading: 'Loading data...',
    currentMonth: 'This Month Performance',
    households: 'Households',
    householdsWorked: 'Worked',
    persondays: 'Person-days',
    womenWork: 'Women Work',
    expenditure: 'Expenditure',
    avgWage: 'Avg Wage',
    works: 'Works',
    completed: 'Completed',
    ongoing: 'Ongoing',
    trend: 'Past Months Trend',
    registered: 'Registered',
    perDay: 'per day',
    crore: 'Cr',
    lakh: 'L'
  }
};

function Dashboard({ district, language, onBack, autoDetected }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    fetchDistrictPerformance(district.district_code)
      .then(result => setData(result))
      .catch(err => console.error('Failed to load performance:', err))
      .finally(() => setLoading(false));
  }, [district]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>{t.loading}</p>
      </div>
    );
  }

  if (!data || !data.performance || data.performance.length === 0) {
    return (
      <div className="dashboard">
        <button className="back-btn" onClick={onBack}>{t.back}</button>
        <div className="no-data">
          {language === 'hi' ? 'डेटा उपलब्ध नहीं है' : 'No data available'}
        </div>
      </div>
    );
  }

  const current = data.performance[0];
  const formatNumber = (num, lang) => {
    if (!num) return '0';
    const n = parseInt(num);
    if (n >= 10000000) return `${(n / 10000000).toFixed(1)} ${t.crore}`;
    if (n >= 100000) return `${(n / 100000).toFixed(1)} ${t.lakh}`;
    return n.toLocaleString('en-IN');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-top">
          <button className="back-btn" onClick={onBack}>
            ← {t.back}
          </button>
          <div className="district-info">
            <h1>{getDistrictName(district.district_name, language)}</h1>
            {autoDetected && <span className="auto-badge">📍 {t.autoDetected}</span>}
          </div>
        </div>
      </div>

      <div className="current-month">
        <div className="section-header">
          <span className="section-icon">📊</span>
          <h2>{t.currentMonth}</h2>
        </div>
        <div className="metrics-grid">
          <MetricCard
            icon="👥"
            title={t.households}
            value={formatNumber(current.total_households_registered, language)}
            subtitle={t.registered}
            color="#4CAF50"
          />
          <MetricCard
            icon="💼"
            title={t.householdsWorked}
            value={formatNumber(current.households_worked, language)}
            subtitle={`${((current.households_worked / current.total_households_registered) * 100).toFixed(0)}%`}
            color="#2196F3"
          />
          <MetricCard
            icon="📊"
            title={t.persondays}
            value={formatNumber(current.total_persondays_generated, language)}
            subtitle=""
            color="#FF9800"
          />
          <MetricCard
            icon="👩"
            title={t.womenWork}
            value={formatNumber(current.women_persondays, language)}
            subtitle={`${((current.women_persondays / current.total_persondays_generated) * 100).toFixed(0)}%`}
            color="#E91E63"
          />
          <MetricCard
            icon="💰"
            title={t.expenditure}
            value={`₹${formatNumber(current.total_expenditure, language)}`}
            subtitle=""
            color="#9C27B0"
          />
          <MetricCard
            icon="💵"
            title={t.avgWage}
            value={`₹${parseFloat(current.avg_wage_per_day).toFixed(0)}`}
            subtitle={t.perDay}
            color="#00BCD4"
          />
          <MetricCard
            icon="✅"
            title={t.completed}
            value={current.works_completed}
            subtitle={t.works}
            color="#4CAF50"
          />
          <MetricCard
            icon="🔄"
            title={t.ongoing}
            value={current.works_ongoing}
            subtitle={t.works}
            color="#FFC107"
          />
        </div>
      </div>

      <div className="trends-section">
        <div className="section-header">
          <span className="section-icon">📈</span>
          <h2>{t.trend}</h2>
        </div>
        <PerformanceChart data={data.performance} language={language} />
      </div>
    </div>
  );
}

export default Dashboard;
