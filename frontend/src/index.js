import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18+
import './index.css'; // You might have a default CSS file here, can be empty or removed if only using Tailwind
import App from './App'; // Import your App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);