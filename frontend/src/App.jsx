import React, { useState } from 'react';
import MobileLayout from './components/MobileLayout/MobileLayout';
import BottomNav from './components/BottomNav/BottomNav';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Catalog from './pages/Catalog/Catalog';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/ProfilePage';
import Venues from './pages/Venues/Venues';
import LeaderPanel from './pages/Leader/LeaderPanel';
import CommunityDetail from './pages/CommunityDetail/CommunityDetail';
import MyCommunities from './pages/MyCommunities/MyCommunities';
import AuthPage from './pages/Auth/AuthPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <MobileLayout>
        <AuthPage onAuth={() => setIsAuthenticated(true)} />
      </MobileLayout>
    );
  }

  return (
    <Router>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/communities" element={<MyCommunities />} />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/venue" element={<Venues />} />
          <Route path="/manage" element={<LeaderPanel />} />
        </Routes>
        <BottomNav />
      </MobileLayout>
    </Router>
  );
}

export default App;

