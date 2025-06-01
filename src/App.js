import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InvitePage from './pages/InvitePage/InvitePage';
import './App.css';

function App() {
  return (
    <div className="app">
      <main className="main">
        <Routes>
          <Route path="/" element={<InvitePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
