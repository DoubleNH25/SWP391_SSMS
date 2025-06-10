import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/auth/Login";
import ConfirmOTP from "@/pages/ConfirmOTP";
import Blog from "@/pages/Blog";
import Calendar from "@/pages/Calendar";
import UserManager from "@/pages/user/ManagerUser";
import AddUser from "@/pages/user/AddUser";
import UpdateUser from "@/pages/user/UpdateUser";
import StudentManager from "@/pages/student/ManagerStudent";
import AddStudent from "@/pages/student/AddStudent";
import UpdateStudents from "@/pages/student/UpdateStudent";
import HealthProfiles from "@/pages/healthprofile/HealthProfile";
import PendingEventManager from "@/pages/medicalevents/PendingEvents";
import ApprovedEventManager from "@/pages/medicalevents/ApprovedEvents";
import { PrivateRoute } from "@/pages/auth/PrivateRoute";
import Unauthorized from "@/pages/auth/Unauthorized";
import CLassSchoolManager from "@/pages/class/ManagerClass";
import AddSchoolClass from "@/pages/class/AddSchoolClass";
import UpdateSchoolClass from "@/pages/class/UpdateSchoolClass";
import EditProfile from "@/pages/user/EditProfile";
import Home from "@/pages/Home";
import MedicalVaccinationRecord from "@/pages/medicalevents/MedicalVaccinationRecord";
import MedicalHealthCheckupRecords from "@/pages/medicalevents/MedicalHealthCheckupRecords";
import ManagerRecord from "@/pages/healthprofile/ManagerRecord";
import ManagerConselingSchedules from "@/pages/conselingshedules/ManagerConselingSchedules";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-otp" element={<ConfirmOTP />} />
          <Route path="/blog" element={<Blog />} />

          <Route path="/profile" element={
            <PrivateRoute allowedRoles={['Admin', 'Manager', 'Nurse', 'Parent']}>
              <EditProfile />
            </PrivateRoute>}
          />

          <Route
            path="/"
            element={
              <PrivateRoute
                allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
              >
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />

            {/*User*/}
            <Route
              path="user"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <UserManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/add-user"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AddUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/update-user/:userId"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <UpdateUser />
                </PrivateRoute>
              }
            />
            {/**Class*/}
            <Route path="/class" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <CLassSchoolManager />
              </PrivateRoute>}
            />
            <Route path="/class/add-class" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <AddSchoolClass />
              </PrivateRoute>}
            />
            <Route path="/class/update-class/:schoolClassId" element={
              <PrivateRoute allowedRoles={['Admin']}>
                <UpdateSchoolClass />
              </PrivateRoute>}
            />
            {/*Student*/}
            <Route
              path="/student"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager"]}>
                  <StudentManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/add-student"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager"]}>
                  <AddStudent />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/update-student/:studentId"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager"]}>
                  <UpdateStudents />
                </PrivateRoute>
              }
            />
            {/*Calender*/}
            <Route
              path="/calendar"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <Calendar />
                </PrivateRoute>
              }
            />

            <Route
              path="/pending-medical-events"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager"]}>
                  <PendingEventManager />
                </PrivateRoute>
              }
            />

            <Route
              path="/approved-medical-events"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <ApprovedEventManager />
                </PrivateRoute>
              }
            />

            <Route
              path="/parent/health-profiles"
              element={
                <PrivateRoute allowedRoles={["Parent"]}>
                  <HealthProfiles />
                </PrivateRoute>
              }
            />

            <Route
              path="/parent/health-checkup"
              element={
                <PrivateRoute allowedRoles={["Parent"]}>
                  <ManagerRecord />
                </PrivateRoute>
              }
            />

            <Route
              path="/medical-vaccination-record/:eventDate"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <MedicalVaccinationRecord />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical-health-checkup-record/:eventDate"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <MedicalHealthCheckupRecords />
                </PrivateRoute>
              }
            />
            <Route
              path="/conseling-schedules"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <ManagerConselingSchedules />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router >
    </>
  );
}

export default App;
