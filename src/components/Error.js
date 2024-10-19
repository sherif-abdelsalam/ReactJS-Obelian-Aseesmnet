import React from 'react';
// import './Error.css';

const Error = ({ message }) => {
  return (
    <div className="error">
      <p>{message || 'Something went wrong!'}</p>
    </div>
  );
};

export default Error;
