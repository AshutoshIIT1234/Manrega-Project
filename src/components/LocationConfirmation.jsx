import React, { useState } from "react";
import { getDistrictName } from "../utils/districtTranslations";
import "./LocationConfirmation.css";

const LocationConfirmation = ({
  detectedDistrict,
  onConfirm,
  onSelectAlternative,
  onManualSelect,
  language,
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);

  const translations = {
    hi: {
      title: "📍 स्थान की पुष्टि करें",
      detected: "हमने पाया:",
      distance: "दूरी",
      km: "किमी",
      accuracy: "सटीकता",
      high: "उच्च",
      low: "कम",
      confirm: "यह सही है",
      showMore: "अन्य विकल्प देखें",
      hideMore: "विकल्प छुपाएं",
      selectManual: "मैं खुद चुनूंगा",
      alternatives: "नजदीकी जिले:",
      warning: "⚠️ आपका स्थान सटीक नहीं है। कृपया सही जिला चुनें।",
    },
    en: {
      title: "📍 Confirm Location",
      detected: "We detected:",
      distance: "Distance",
      km: "km",
      accuracy: "Accuracy",
      high: "High",
      low: "Low",
      confirm: "This is correct",
      showMore: "Show alternatives",
      hideMore: "Hide alternatives",
      selectManual: "I'll choose manually",
      alternatives: "Nearby districts:",
      warning:
        "⚠️ Your location is not very accurate. Please choose the correct district.",
    },
  };

  const t = translations[language];
  const isLowAccuracy =
    detectedDistrict.confidence === "low" || detectedDistrict.distance > 50;

  return (
    <div className="location-confirmation">
      <div className="confirmation-card">
        <h2>{t.title}</h2>

        {isLowAccuracy && <div className="warning-message">{t.warning}</div>}

        <div className="detected-district">
          <h3>{t.detected}</h3>
          <div
            className={`district-card ${
              isLowAccuracy ? "low-accuracy" : "high-accuracy"
            }`}
          >
            <div className="district-name">
              {getDistrictName(detectedDistrict.district_name, language)}
            </div>
            <div className="district-details">
              <span className="distance">
                {t.distance}: {detectedDistrict.distance} {t.km}
              </span>
              <span className={`accuracy ${detectedDistrict.confidence}`}>
                {t.accuracy}:{" "}
                {detectedDistrict.confidence === "high" ? t.high : t.low}
              </span>
            </div>
            {detectedDistrict.message && (
              <div className="district-message">{detectedDistrict.message}</div>
            )}
          </div>
        </div>

        <div className="confirmation-actions">
          <button
            className="confirm-btn"
            onClick={() => onConfirm(detectedDistrict)}
          >
            {t.confirm}
          </button>

          {detectedDistrict.alternatives &&
            detectedDistrict.alternatives.length > 0 && (
              <button
                className="alternatives-btn"
                onClick={() => setShowAlternatives(!showAlternatives)}
              >
                {showAlternatives ? t.hideMore : t.showMore}
              </button>
            )}

          <button className="manual-btn" onClick={onManualSelect}>
            {t.selectManual}
          </button>
        </div>

        {showAlternatives && detectedDistrict.alternatives && (
          <div className="alternatives-section">
            <h4>{t.alternatives}</h4>
            <div className="alternatives-grid">
              {detectedDistrict.alternatives.map((district, index) => (
                <div
                  key={index}
                  className="alternative-card"
                  onClick={() => onSelectAlternative(district)}
                >
                  <div className="alt-name">
                    {getDistrictName(district.district_name, language)}
                  </div>
                  <div className="alt-distance">
                    {district.distance} {t.km}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationConfirmation;
