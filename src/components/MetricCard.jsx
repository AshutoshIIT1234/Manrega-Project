import React from 'react';
import './MetricCard.css';

function MetricCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="metric-card" style={{ '--card-color': color }}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      {subtitle && <div className="metric-subtitle">{subtitle}</div>}
    </div>
  );
}

export default MetricCard;
