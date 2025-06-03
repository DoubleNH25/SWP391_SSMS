import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/auth/Login";
import ConfirmOTP from "./pages/ConfirmOTP";
import Blog from "./pages/Blog";
import Calendar from "./pages/Calendar";
import UserManager from "./pages/user/ManagerUser";
import AddUser from "./pages/user/AddUser";
import UpdateUser from "./pages/user/UpdateUser";
import StudentManager from "./pages/student/ManagerStudent";
import AddStudent from "./pages/student/AddStudent";
import UpdateStudents from "./pages/student/UpdateStudent";
import HealthProfiles from "./pages/healthprofile/HealthProfile";
import PendingEventManager from "./pages/medicalevents/PendingEvents";
import ApprovedEventManager from "./pages/medicalevents/ApprovedEvents";
import { PrivateRoute, RoleBasedRedirect } from "./pages/auth/PrivateRoute";
import Unauthorized from "./pages/auth/Unauthorized";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-otp" element={<ConfirmOTP />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/" element={
            <PrivateRoute allowedRoles={['Admin', 'Manager', 'Nurse', 'Parent']}>
              <AppLayout />
            </PrivateRoute>
          }>
            <Route
              index
              element={
                <RoleBasedRedirect />
              }
            />

            {/*User*/}
            <Route path="/user" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <UserManager />
              </PrivateRoute>}
            />
            <Route path="/user/add-user" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <AddUser />
              </PrivateRoute>}
            />
            <Route path="/user/update-user/:userId" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <UpdateUser />
              </PrivateRoute>}
            />
            {/*Student*/}
            <Route path="/student" element={
              <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                <StudentManager />
              </PrivateRoute>}
            />
            <Route path="/student/add-student" element={
              <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                <AddStudent />
              </PrivateRoute>}
            />
            <Route path="/student/update-student/:studentId" element={
              <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                <UpdateStudents />
              </PrivateRoute>}
            />
            {/*Calender*/}
            <Route path="/calendar" element={
              <PrivateRoute allowedRoles={['Admin', 'Manager', 'Nurse']}>
                <Calendar />
              </PrivateRoute>}
            />

            <Route path="/pending-medical-events" element={
              <PrivateRoute allowedRoles={['Admin', 'Manager']}>
                <PendingEventManager />
              </PrivateRoute>}
            />

            <Route path="/approved-medical-events" element={
              <PrivateRoute allowedRoles={['Admin', 'Manager', 'Nurse']}>
                <ApprovedEventManager />
              </PrivateRoute>}
            />

            <Route path="/parent/health-profiles" element={
              <PrivateRoute allowedRoles={['Parent']}>
                <HealthProfiles />
              </PrivateRoute>}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
