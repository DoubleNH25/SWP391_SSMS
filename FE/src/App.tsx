import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import StudentProfiles from "./pages/StudentProfiles";
import Login from "./pages/Login";
import ConfirmOTP from "./pages/ConfirmOTP";
import Blog from "./pages/Blog";
import { Calendar } from "lucide-react";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="/student" element={<StudentProfiles />} />
            <Route path="/login" element={<Login />} />
            <Route path="/confirm-otp" element={<ConfirmOTP />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/calendar" element={<Calendar />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
