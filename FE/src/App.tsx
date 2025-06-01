import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import ConfirmOTP from "./pages/ConfirmOTP";
import Blog from "./pages/Blog";
import { Calendar } from "lucide-react";
import UserManager from "./pages/user/ManagerUser";
import AddUser from "./pages/user/AddUser";
import UpdateUser from "./pages/user/UpdateUser";
import StudentManager from "./pages/student/ManagerStudent";
import AddStudent from "./pages/student/AddStudent";
import UpdateStudents from "./pages/student/UpdateStudent";
import HealthProfiles from "./pages/healthprofile/HealthProfile";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/confirm-otp" element={<ConfirmOTP />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/user" element={<UserManager />} />
            <Route path="/user/add-user" element={<AddUser />} />
            <Route path="/user/update-user/:userId" element={<UpdateUser />} />
            <Route path="/student" element={<StudentManager />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/student/add-student" element={<AddStudent />} />
            <Route path="/student/update-student/:studentId" element={<UpdateStudents />} />
            <Route path="/parent/health-profiles" element={<HealthProfiles />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
