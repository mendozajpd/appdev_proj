import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import HomePage from "./js/HomePage";
import Register from "./js/Register";
import Login from "./js/Login";
import AdminDashboard from "./js/AdminDashboard";
import AdminManageUsers from "./js/AdminManageUsers";
// import sidebar from './Sidebar'; // Import Sidebar component
import EmptyPage from "./js/EmptyPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingRequests from "./js/PendingRequests";
import Banned from "./js/Banned"
import ProfilePage from "./js/ProfilePage";


function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<AdminManageUsers />} />
          <Route path="/admin/pending-requests" element={<PendingRequests />} />
          <Route path="/admin/banned" element={<Banned />} />
          <Route path="*" element={<EmptyPage />} />
          <Route path="/admin/profilepage" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router >
  );
}

export default App;
