import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Notifications from "./components/utility/Notifications";
import CalendarPage from "./components/utility/Calendar";
import SettingsPage from "./components/utility/Settings";
import AssignmentInterface from "./components/assignments/AssignmentInterface";
import { HostFamilyManagement } from "./components/host-families/HostFamilyManagement";
import ParticipantManagement from "./components/participants/ParticipantManagement";
import PaymentTracking from "./components/payments/PaymentTracking";
import { HelpSupport } from "./components/utility/HelpSupport";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="notifications" element={<Notifications />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="assignments" element={<AssignmentInterface />} />
            <Route path="participants" element={<ParticipantManagement />} />
            <Route path="host-families" element={<HostFamilyManagement />} />
            <Route path="payments" element={<PaymentTracking />} />
            <Route path="help" element={<HelpSupport />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
