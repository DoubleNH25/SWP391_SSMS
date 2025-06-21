import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/auth/Login";
import ConfirmOTP from "@/pages/auth/ConfirmOTP";
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
import Home from "@/pages/Home";
import MedicalVaccinationRecord from "@/pages/medicalevents/MedicalVaccinationRecord";
import MedicalHealthCheckupRecords from "@/pages/medicalevents/MedicalHealthCheckupRecords";
import ManagerRecord from "@/pages/healthprofile/ManagerRecord";
import ManagerConselingSchedules from "@/pages/conselingshedules/ManagerConselingSchedules";
import ManagerHealthProfile from "./pages/healthprofile/UpdateCreateHealthProfile";
import ManagerMedical from "./pages/medical/ManagerMedical";
import UpdateMedical from "./pages/medical/UpdateMedical";
import CreateMedical from "./pages/medical/CreateMedical";
import HealthCheckupRecords from "./pages/healthprofile/HealthCheckupRecords";
import MedicalRequest from "./pages/medicalrequest/MedicalRequest";
import ManagerMedicalRequest from "./pages/medicalrequest/ManagerMedicalRequest";
import ManagerActivityMedical from "./pages/acivitymedical/ManagerActivityMedical";
import EditProfile from "./pages/user/EditProfile";
import CreateMedicalIncident from "./pages/medicalincident/CreateMedicalIncident";
import ConselingScheduleAbnormal from "./pages/conselingshedules/ConselingScheduleAbnormal";
import ManagerMedicalIncident from "./pages/medicalincident/ManagerMedicalIncident";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-otp" element={<ConfirmOTP />} />
          <Route path="/profile" element={<EditProfile />} />
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
            <Route path="blog" element={<Blog />} />

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
            <Route
              path="/class"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <CLassSchoolManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/class/add-class"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AddSchoolClass />
                </PrivateRoute>
              }
            />
            <Route
              path="/class/update-class/:schoolClassId"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <UpdateSchoolClass />
                </PrivateRoute>
              }
            />
            {/*Student*/}
            <Route
              path="/student"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
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
              path="/medical-vaccination-record/:eventDate/:id"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <MedicalVaccinationRecord />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical-health-checkup-record/:eventDate/:id"
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
            <Route
              path="/healthprofile/manager-health-profile/:studentId"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <ManagerHealthProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical/manager-medical"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <ManagerMedical />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical/update-medical/:medicalId"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <UpdateMedical />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical/create-medical"
              element={
                <PrivateRoute allowedRoles={["Admin", "Manager", "Nurse"]}>
                  <CreateMedical />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/:studentId/health-checkup-records"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <HealthCheckupRecords />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical/medical-request"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <MedicalRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical/manager-medical-request"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <ManagerMedicalRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical/manager-medical-request/:studentId"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <ManagerMedicalRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/activity-medical"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <ManagerActivityMedical />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical/medical-incident/:studentId"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <CreateMedicalIncident />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical/manager-medical-incident/:studentId"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <ManagerMedicalIncident />
                </PrivateRoute>
              }
            />
            <Route
              path="/activity-medical/:eventId"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse", "Parent"]}
                >
                  <ManagerActivityMedical />
                </PrivateRoute>
              }
            />
            <Route
              path="/conseling-schedules/abnormal"
              element={
                <PrivateRoute
                  allowedRoles={["Admin", "Manager", "Nurse"]}
                >
                  <ConselingScheduleAbnormal />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
