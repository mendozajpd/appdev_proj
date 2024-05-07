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
import PendingRequests from "./js/admin/PendingRequests";
import Banned from "./js/admin/Banned"
import ArtistPage from "./js/ArtistPage";
import PlaylistPage from "./js/PlaylistPage";
import QueuePage from "./js/QueuePage";
import EmptyPage from "./js/EmptyPage";
import ArtistContent from "./js/ArtistContent";
import ArtistUpload from "./js/ArtistUpload";
import ArtistDashboard from "./js/ArtistDashboard";
import StudioAlbumPage from "./js/StudioAlbumPage";

// Layouts
import RootLayout from "./js/layouts/RootLayout";
import UserLayout from "./js/layouts/UserLayout";
import StudioLayout from "./js/layouts/StudioLayout";

// Context
import PlayerContext from "./js/context/PlayerContext";

function App() {

  const [currentSongName, setCurrentSongName] = useState(null);
  const [currentSongUrl, setCurrentSongUrl] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playingViewActive, setPlayingViewActive] = useState(false);
  const [songID, setSongID] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentQueue, setCurrentQueue] = useState(-1);

  return (
    <Router>
      <ToastContainer />
      <PlayerContext.Provider value={{
        currentSongName,
        setCurrentSongName,
        currentSong: currentSongUrl,
        setCurrentSong: setCurrentSongUrl,
        songID,
        setSongID,
        queue,
        setQueue,
        currentQueue,
        setCurrentQueue,
        currentPlaylist,
        setCurrentPlaylist,
        playingViewActive,
        setPlayingViewActive
      }}>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            {/* <Route path="/artist/:id" element={<ArtistPage />} /> */}
            {/* <Route path="/upload" element={<ArtistUpload />} /> */}
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/user/:id" element={<ArtistPage />} />
          </Route>
          <Route path="studio" element={<StudioLayout />}>
            <Route index element={<ArtistDashboard />} />
            <Route path="content" element={<ArtistContent />} />
            <Route path="upload" element={<ArtistUpload />} />
            <Route path="queue" element={<QueuePage />} />
            <Route path="album/:id" element={<StudioAlbumPage />} />
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
