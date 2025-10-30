import React, { useState, useEffect } from "react";
import GovHeader from "./components/GovHeader";
import DistrictSelector from "./components/DistrictSelector";
import Dashboard from "./components/Dashboard";
import LanguageToggle from "./components/LanguageToggle";
import LocationPermission from "./components/LocationPermission";
import LocationConfirmation from "./components/LocationConfirmation";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("hi"); // hi or en
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const [showLocationPermission, setShowLocationPermission] = useState(true);
  const [locationSkipped, setLocationSkipped] = useState(false);
  const [detectedDistrict, setDetectedDistrict] = useState(null);
  const [showLocationConfirmation, setShowLocationConfirmation] =
    useState(false);

  // Check if user has previously made a choice
  useEffect(() => {
    const hasSkippedLocation = localStorage.getItem("locationSkipped");
    const hasDetectedLocation = localStorage.getItem("lastDetectedDistrict");

    if (hasSkippedLocation || hasDetectedLocation) {
      setShowLocationPermission(false);
      setLocationSkipped(!!hasSkippedLocation);
    }
  }, []);

  const handleLocationDetected = (district) => {
    setDetectedDistrict(district);
    setShowLocationPermission(false);

    // If high confidence or very close, auto-select
    if (district.confidence === "high" && district.distance <= 25) {
      setSelectedDistrict(district);
      setAutoDetected(true);
      localStorage.setItem("lastDetectedDistrict", JSON.stringify(district));
      localStorage.removeItem("locationSkipped");
    } else {
      // Show confirmation for low accuracy
      setShowLocationConfirmation(true);
    }
  };

  const handleLocationSkipped = () => {
    setShowLocationPermission(false);
    setLocationSkipped(true);
    localStorage.setItem("locationSkipped", "true");
    localStorage.removeItem("lastDetectedDistrict");
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setAutoDetected(false);
  };

  const handleBack = () => {
    setSelectedDistrict(null);
  };

  const handleRetryLocation = () => {
    setShowLocationPermission(true);
    setLocationSkipped(false);
    setShowLocationConfirmation(false);
    setDetectedDistrict(null);
    localStorage.removeItem("locationSkipped");
  };

  const handleLocationConfirmed = (district) => {
    setSelectedDistrict(district);
    setAutoDetected(true);
    setShowLocationConfirmation(false);
    localStorage.setItem("lastDetectedDistrict", JSON.stringify(district));
    localStorage.removeItem("locationSkipped");
  };

  const handleAlternativeSelected = (district) => {
    setSelectedDistrict(district);
    setAutoDetected(true);
    setShowLocationConfirmation(false);
    localStorage.setItem("lastDetectedDistrict", JSON.stringify(district));
  };

  const handleManualSelection = () => {
    setShowLocationConfirmation(false);
    setLocationSkipped(true);
    localStorage.setItem("locationSkipped", "true");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>{language === "hi" ? "लोड हो रहा है..." : "Loading..."}</p>
      </div>
    );
  }

  // Show location permission screen first
  if (showLocationPermission) {
    return (
      <div className="app">
        <LanguageToggle language={language} setLanguage={setLanguage} />
        <LocationPermission
          onLocationDetected={handleLocationDetected}
          onSkip={handleLocationSkipped}
          language={language}
        />
      </div>
    );
  }

  // Show location confirmation if needed
  if (showLocationConfirmation && detectedDistrict) {
    return (
      <div className="app">
        <LanguageToggle language={language} setLanguage={setLanguage} />
        <LocationConfirmation
          detectedDistrict={detectedDistrict}
          onConfirm={handleLocationConfirmed}
          onSelectAlternative={handleAlternativeSelected}
          onManualSelect={handleManualSelection}
          language={language}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <GovHeader language={language} />
      <LanguageToggle language={language} setLanguage={setLanguage} />

      {!selectedDistrict ? (
        <DistrictSelector
          onSelect={handleDistrictSelect}
          language={language}
          onRetryLocation={locationSkipped ? handleRetryLocation : null}
        />
      ) : (
        <Dashboard
          district={selectedDistrict}
          language={language}
          onBack={handleBack}
          autoDetected={autoDetected}
        />
      )}
    </div>
  );
}

export default App;
