import React, { useRef } from 'react';
import CryptoPrices from './components/CryptoPrices';
import Weather from './components/Weather';
import CovidStats from './components/CovidStats';
import './App.css';



function App() {
  const weatherRef = useRef(null);
  const cryptoRef = useRef(null);
  const covidRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      console.log(ref);
      ref.current.scrollIntoView({ behavior: 'smooth', block:'start' });
    }
  };

  return (
    <div className="App">      

      <div className='home-container'>
        <header className="app-header">
          <h1>Dashboard</h1>
          <div className="scroll-links">
            <button onClick={() => scrollToSection(weatherRef)}>Weather Information</button>
            <button onClick={() => scrollToSection(cryptoRef)}>Cryptocurrency Prices</button>
            <button onClick={() => scrollToSection(covidRef)}>COVID-19 Statistics</button>
          </div>
        </header>
      </div>

      <div className="content">
        <div ref={weatherRef}> <Weather /> </div>
        <div ref={cryptoRef}> <CryptoPrices /> </div>
        <div ref={covidRef}> <CovidStats /> </div>

      </div>
    </div>
  );
}

export default App;
