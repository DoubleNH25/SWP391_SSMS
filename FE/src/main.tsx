import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import StudentProfiles from "@/pages/StudentProfiles";
import Login from "./pages/Login";
import ConfirmOTP from "./pages/ConfirmOTP";
import Blog from "./pages/Blog";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<StudentProfiles />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/confirm-otp" element={<ConfirmOTP />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
