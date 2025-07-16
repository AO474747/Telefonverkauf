import React from 'react';
import EingabeFormular from '../components/EingabeFormular';
import '../style.css';

function App() {
  return (
    <div className="container">
      <div className="header">
        <h1>🏢 Telefon Verkauf</h1>
        <p>Glas-Angebotserstellung</p>
      </div>
      <EingabeFormular />
    </div>
  );
}

export default App; 