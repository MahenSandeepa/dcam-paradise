import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './HomePage';              // Import Page 1
import BingeCalculator from './BingeCalculator'; // Import Page 2

function App() {
  return (
    <BrowserRouter>
      {/* Optional: A Navigation Bar that stays at the top */}
      <nav style={{ padding: '20px', backgroundColor: '#112240', textAlign: 'center' }}>
        <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</Link>
        <Link to="/calculator" style={{ color: '#64ffda', textDecoration: 'none', fontWeight: 'bold' }}>🧮 Calculator</Link>
      </nav>

      {/* The Area that switches content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<BingeCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;