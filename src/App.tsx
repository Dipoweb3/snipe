// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/index';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;
