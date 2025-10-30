import React from 'react';
import './PerformanceChart.css';

const PerformanceChart = ({ data, language }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p>{language === 'hi' ? 'चार्ट डेटा उपलब्ध नहीं है' : 'No chart data available'}</p>
      </div>
    );
  }

  // Get last 6 months of data
  const chartData = data.slice(0, 6).reverse();
  
  // Find max values for scaling
  const maxPersondays = Math.max(...chartData.map(d => d.total_persondays_generated || 0));
  const maxExpenditure = Math.max(...chartData.map(d => d.total_expenditure || 0));

  const formatMonth = (dateStr, lang) => {
    const date = new Date(dateStr);
    const months = {
      hi: ['जन', 'फर', 'मार', 'अप्र', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस'],
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    return months[lang][date.getMonth()];
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    const n = parseInt(num);
    if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className="chart-container">
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color persondays"></span>
          <span>{language === 'hi' ? 'व्यक्ति-दिवस' : 'Person-days'}</span>
        </div>
        <div className="legend-item">
          <span className="legend-color expenditure"></span>
          <span>{language === 'hi' ? 'खर्च (₹)' : 'Expenditure (₹)'}</span>
        </div>
      </div>
      
      <div className="chart">
        {chartData.map((item, index) => {
          const persondaysHeight = (item.total_persondays_generated / maxPersondays) * 100;
          const expenditureHeight = (item.total_expenditure / maxExpenditure) * 100;
          
          return (
            <div key={index} className="chart-bar-group">
              <div className="chart-bars">
                <div 
                  className="chart-bar persondays"
                  style={{ height: `${persondaysHeight}%` }}
                  title={`${language === 'hi' ? 'व्यक्ति-दिवस' : 'Person-days'}: ${formatNumber(item.total_persondays_generated)}`}
                ></div>
                <div 
                  className="chart-bar expenditure"
                  style={{ height: `${expenditureHeight}%` }}
                  title={`${language === 'hi' ? 'खर्च' : 'Expenditure'}: ₹${formatNumber(item.total_expenditure)}`}
                ></div>
              </div>
              <div className="chart-label">
                {formatMonth(item.month_year, language)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceChart;