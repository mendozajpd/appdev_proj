import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Stack, Card } from "react-bootstrap";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import BACKEND_URL from "../config";
import UserSidebar from "./UserSidebar";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ArtistItem from "./items/ArtistItem";


const HomePage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [logoutDisabled, setLogoutDisabled] = useState(false);

  const [artists, setArtists] = useState([]);

  // Player
  const [currentSong, setCurrentSong] = useState(null);
  const playerRef = useRef();

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    // const token = localStorage.getItem("jwt_token");
    // if (!token) {
    //   navigate('/login');
    // } else {
    //   fetchUserDetails();
    // }




  }, [isVerified]);

  // NAVIGATION
  const navigate = useNavigate();



  const buttonStyle = {
    marginTop: "30px",
    fontSize: "150%",
    borderRadius: "20px",
    width: "100%",
    height: "50px",
    marginBottom: "10px",
    backgroundColor: "transparent",
    borderColor: "#8d4b4b",
    color: "#ff3535",
    transition: "background-color 0.3s, color 0.3s, transform 0.3",
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "red";
    e.target.style.color = "white";
    e.target.style.borderColor = "#8d4b4b";
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#ff3535";
    e.target.style.borderColor = "#8d4b4b";
  };



  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data; // Assuming user details are directly in response.data
      //console.log(userData);
      setIsVerified(userData.email_verified_at !== null);
      if (userData.email_verified_at === null) {
        handleShow();
      }

      // Check if the user has admin or superadmin role
      const isAdmin = userData.role.includes('admin');
      const isSuperAdmin = userData.role.includes('superadmin');
      if (isAdmin || isSuperAdmin) {
        navigate('/admin');
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("jwt_token");
    }
  };

  const handleSendVerify = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); // disable the button
    setRemainingTime(180); // set remaining time to 3 minutes
    const timerId = setInterval(() => {
      setRemainingTime((time) => time - 1);
    }, 1000);
    setTimeout(() => {
      setIsButtonDisabled(false); // enable the button after 3 minutes
      clearInterval(timerId); // clear the interval
    }, 3 * 60 * 1000);
    try {
      const token = localStorage.getItem("jwt_token");
      const userDetailsResponse = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userDetailsResponse.data;
      const response = await axios.post(
        `${BACKEND_URL}/api/resend-verification-email`,
        {
          name: user.name, // use the name from the user's details
          email: user.email, // use the email from the user's details
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (setShow) {
        handleClose();
      }
      //console.log(response.data);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };



  return (
    <>
      <div className="text-white p-5">
        New Artists
        <div className="d-flex gap-2 item-container p-2">
          <ArtistItem/>
        </div>
      </div>
    </>
  );
};

export default HomePage;
