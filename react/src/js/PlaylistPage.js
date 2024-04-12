import React, { useState, useEffect, useRef, CSSProperties, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Stack } from "react-bootstrap";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import BACKEND_URL from "../config";
import UserSidebar from "./UserSidebar";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners"
import ArtistAlbumItem from "./items/ArtistAlbumItem";

// Table
import { PlaylistSongsTable } from "./tables/PlaylistSongsTable";

// Context
import PlayerContext from "./context/PlayerContext";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const PlaylistPage = () => {
  let [loading, setLoading] = useState(true);

  const [isVerified, setIsVerified] = useState(false);

  const [playlist, setPlaylist] = useState(null);
  const { id } = useParams();

  // SONGS
  const [songs, setSongs] = useState([]);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // PLAYLIST



  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate('/login');
    } else {
      fetchUserDetails();
    }

    axios.get(`${BACKEND_URL}/api/playlist/${id}`)
      .then(response => {
        setPlaylist(response.data);
      }).catch(error => {
        console.error('There was an error!', error);
      });

  }, [id, isVerified]);

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




  return (
    <>
      <div className="home-page d-flex vh-100">
        {/* <UserSidebar /> */}
        <Modal show={show} onHide={handleClose} backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Email Verification Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              We noticed that your email address has not been verified yet.
              To ensure the security of your account and to gain full access
              to all features of our application, it's important to verify your
              email address. We kindly request you to check your email for the verification link.
            </p></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
        <Container className="home-page-content" fluid>
          <Row className="h-100 overflow-hidden">
            <Col className="vh-100 overflow-auto mb-5 custom-scrollbar">
              <Row className="artist-banner p-5">
                {/* <Form.Control className="search-bar" placeholder="Search" /> */}
                <h1 className="home-page-text h-100 mb-5 d-flex align-items-end">
                  <Image src="https://via.placeholder.com/100" style={{ width: '100px', height: '100px', marginRight: '15px' }} />
                  {playlist ?
                    <p className="display-6">
                      {playlist.name}
                    </p>
                    : 'Loading...'}
                </h1>
              </Row>
              <Row className="px-5 py-2 d-flex flex-row">
                <div className="d-flex align-items-center">
                  <i className="fa fa-play text-white bg-danger p-3 rounded-circle" />
                  <div className="mx-3">
                    <i className="fa fa-random text-white p-3 display-6" />
                  </div>
                  <Button variant="outline-light">
                    <i className="fa fa-plus p-1"/>
                    Add Songs
                  </Button>
                </div>
              </Row>
              <Row className="px-5">
                <PlaylistSongsTable />
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default PlaylistPage;
