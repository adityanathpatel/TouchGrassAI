import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Preferences from './pages/Preferences';
import CreateAdventure from './pages/CreateAdventure';
import AdventurePreview from './pages/AdventurePreview';
import RouteMap from './pages/RouteMap';
import DownloadAdventure from './pages/DownloadAdventure';
import OfflineAdventure from './pages/OfflineAdventure';
import OutdoorMode from './pages/OutdoorMode';
import AddObservation from './pages/AddObservation';
import CameraPhoto from './pages/CameraPhoto';
import AdventureProgress from './pages/AdventureProgress';
import FinishAdventure from './pages/FinishAdventure';
import Journal from './pages/Journal';
import PreviousAdventures from './pages/PreviousAdventures';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/create" element={<CreateAdventure />} />
          <Route path="/preview/:id" element={<AdventurePreview />} />
          <Route path="/route-map/:id" element={<RouteMap />} />
          <Route path="/download/:id" element={<DownloadAdventure />} />
          <Route path="/offline/:id" element={<OfflineAdventure />} />
          <Route path="/outdoor/:id" element={<OutdoorMode />} />
          <Route path="/observation/:id" element={<AddObservation />} />
          <Route path="/camera/:id" element={<CameraPhoto />} />
          <Route path="/progress/:id" element={<AdventureProgress />} />
          <Route path="/finish/:id" element={<FinishAdventure />} />
          <Route path="/journal/:id" element={<Journal />} />
          <Route path="/previous" element={<PreviousAdventures />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
