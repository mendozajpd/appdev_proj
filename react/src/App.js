import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./js/HomePage";
import Register from "./js/Register";
import Login from "./js/Login";
import AdminDashboard from "./js/AdminDashboard";
import AdminManageUsers from "./js/AdminManageUsers";
import EmptyPage from "./js/EmptyPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingRequests from "./js/PendingRequests";
import Banned from "./js/Banned";
import AdminProfile from "./js/adminprofiles/AdminProfile";
import ProfileManagement from './js/adminprofiles/ProfileManagement'; // Adjust the path as necessary

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/adminprofile" element={<AdminProfile />} />
          <Route path="/profile-management" element={<ProfileManagement />} /> {/* Corrected */}
          <Route path="/admin/manage-users" element={<AdminManageUsers />} />
          <Route path="/admin/pending-requests" element={<PendingRequests />} />
          <Route path="/admin/banned" element={<Banned />} />
          <Route path="*" element={<EmptyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
