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
import AdminDashbooard from "./js/AdminDashboard";
import EmptyPage from "./js/EmptyPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<Register />} />
          <Route path="/admin" element={<AdminDashbooard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<EmptyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
