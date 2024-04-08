import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BACKEND_URL from "./config";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";



// Pages
import Register from "./js/pages/root/Register";
import Login from "./js/pages/root/Login";
import HomePage from "./js/HomePage";
import AdminDashboard from "./js/admin/AdminDashboard";
import AdminManageUsers from "./js/admin/AdminManageUsers";
import ArtistUpload from "./js/ArtistUpload";
import PendingRequests from "./js/admin/PendingRequests";
import Banned from "./js/admin/Banned"
import ArtistPage from "./js/ArtistPage";
import EmptyPage from "./js/EmptyPage";

// Layouts
import RootLayout from "./js/layouts/RootLayout";
import UserLayout from "./js/layouts/UserLayout";

// Context
import PlayerContext from "./js/context/PlayerContext";

function App() {

  const [currentSongName, setCurrentSongName] = useState(null);
  const [currentSongUrl, setCurrentSongUrl] = useState(null);

  return (
    <Router>
      <ToastContainer />
      <PlayerContext.Provider value={{ currentSongName, setCurrentSongName, currentSong: currentSongUrl, setCurrentSong: setCurrentSongUrl }}>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/upload" element={<ArtistUpload />} />
          </Route>
          <Route path="/" element={<RootLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </PlayerContext.Provider>

      {/* <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<AdminManageUsers />} />
          <Route path="/admin/pending-requests" element={<PendingRequests />} />
          <Route path="/admin/banned" element={<Banned />} />
        <Route path="*" element={<EmptyPage />} /> */}
    </Router >
  );
}

export default App;
