import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Error from './Error';
import './CryptoPrices.css';

const CryptoPrices = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
        const data = await response.json();
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch cryptocurrency data.');
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  return (
    <div className="crypto-section">
      <h2>Cryptocurrency Prices</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error message={error} />
      ) : (
        <div className="crypto-list">
          {cryptoData.map(crypto => (
            <div key={crypto.id} className="crypto">
              <img src={crypto.image} alt={`${crypto.name} logo`} className="crypto-logo" />
              <h3>{crypto.name} ({crypto.symbol.toUpperCase()})</h3>
              <p> Current Price: </p>
              <span className='crypto-desc'>${crypto.current_price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoPrices;
