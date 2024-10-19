import React, { useRef } from 'react';
import CryptoPrices from './components/CryptoPrices';
import Weather from './components/Weather';
import CovidStats from './components/CovidStats';
import './App.css';

function App() {
  // Create refs for each section
  const weatherRef = useRef(null);
  const cryptoRef = useRef(null);
  const covidRef = useRef(null);

  // Scroll to the respective section
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Live Dashboard</h1>
        <nav className="nav-links">
          <button onClick={() => scrollToSection(weatherRef)}>Weather Information</button>
          <button onClick={() => scrollToSection(cryptoRef)}>Cryptocurrency Prices</button>
          <button onClick={() => scrollToSection(covidRef)}>COVID-19 Statistics</button>
        </nav>
      </header>
      <div className="content">
        {/* Attach refs to each component */}
        <div ref={weatherRef}>
          <Weather />
        </div>
        <div ref={cryptoRef}>
          <CryptoPrices />
        </div>
        <div ref={covidRef}>
          <CovidStats />
        </div>
      </div>
    </div>
  );
}

export default App;
