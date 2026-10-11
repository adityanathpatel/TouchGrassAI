import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/Home";
import { OnboardingPage } from "./pages/Onboarding";
import { PreferencesPage } from "./pages/Preferences";
import { CreateAdventurePage } from "./pages/CreateAdventure";
import { AdventurePreviewPage } from "./pages/AdventurePreview";
import { RouteMapPage } from "./pages/RouteMap";
import { OfflinePackPage } from "./pages/OfflinePack";
import { OutdoorModePage } from "./pages/OutdoorMode";
import { AddObservationPage } from "./pages/AddObservation";
import { ProgressPage } from "./pages/Progress";
import { FinishPage } from "./pages/Finish";
import { JournalPage } from "./pages/Journal";
import { AdventuresPage } from "./pages/Adventures";
import { SettingsPage } from "./pages/Settings";
import { PrivacyPage } from "./pages/Privacy";
import { DemoPage } from "./pages/Demo";
import { CameraPage } from "./pages/Camera";

export default function App() {
  const location = useLocation();
  const outdoor = location.pathname.startsWith("/outdoor/");
  return (
    <Layout outdoor={outdoor}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/create" element={<CreateAdventurePage />} />
        <Route path="/preview/:id" element={<AdventurePreviewPage />} />
        <Route path="/map/:id" element={<RouteMapPage />} />
        <Route path="/offline/:id" element={<OfflinePackPage />} />
        <Route path="/outdoor/:id" element={<OutdoorModePage />} />
        <Route path="/observe/:id" element={<AddObservationPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/camera/:id" element={<CameraPage />} />
        <Route path="/progress/:id" element={<ProgressPage />} />
        <Route path="/finish/:id" element={<FinishPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/:id" element={<JournalPage />} />
        <Route path="/adventures" element={<AdventuresPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

