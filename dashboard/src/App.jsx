import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import DashboardView from "./views/DashboardView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/dashboard" element={<DashboardView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
