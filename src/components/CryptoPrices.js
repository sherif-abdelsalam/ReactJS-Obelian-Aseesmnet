import React, { useState, useEffect } from 'react';
import '../styles/CryptoPrices.css'; 


const CryptoPrices = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [currency, setCurrency] = useState('usd'); // Default to USD
  const [currencies, setCurrencies] = useState([]); // List of currencies from API

  // Fetch available currencies from the API
  useEffect(() => {
    const fetchSupportedCurrencies = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies');
        const data = await response.json();
        setCurrencies(data); // Set available currencies for the dropdown
      } catch (error) {
        console.log('Failed to fetch supported currencies.');
      }
    };

    fetchSupportedCurrencies();
  }, []);

  // Fetch cryptocurrency data based on selected currency and set up real-time refresh
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1`
        );
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.log('Failed to fetch cryptocurrency data.');
      }
    };

    // Initial fetch
    fetchCryptoData();

    // Set up real-time updates (e.g., every 60 seconds)
    const intervalId = setInterval(fetchCryptoData, 60000); // Update every 60 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [currency]); // Refetch data when currency changes

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value); // Set selected currency
  };

  return (
    <div className="crypto-section">
      <h2>Cryptocurrency Prices</h2>
      
      {currencies.length > 0 
      && 
      (
        <div className="currency-selector">
          <label className='Select-currency-lable' htmlFor="currency">Select Currency: </label>
          <select id="currency" value={currency} onChange={handleCurrencyChange}>
            {currencies.map((currencyOption) => (
              <option key={currencyOption} value={currencyOption}>
                {currencyOption.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

    <div className="crypto-list">
        {cryptoData.map((crypto) => (
          <div key={crypto.id} className="crypto">
            <img src={crypto.image} alt={`${crypto.name} logo`} className="crypto-logo" />
            <h3>{crypto.name} ({crypto.symbol.toUpperCase()})</h3>
            <p>Current Price:</p>
            <span className='crypto-desc'>
              {currency.toUpperCase()} {crypto.current_price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoPrices;
