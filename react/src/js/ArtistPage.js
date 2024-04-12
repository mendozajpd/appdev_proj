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

// Context
import PlayerContext from "./context/PlayerContext";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const ArtistPage = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  const [isVerified, setIsVerified] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [logoutDisabled, setLogoutDisabled] = useState(false);

  const [artist, setArtist] = useState(null);
  const { id } = useParams();

  // Player
  const {setCurrentSong, setCurrentSongName } = useContext(PlayerContext);
  const playerRef = useRef();

  const handlePlayerSongChange = (song) => {
    setCurrentSong(song);
  }

  const handlePlayerSongNameChange = (song) => {
    setCurrentSongName(song);
  }

  // SONGS
  const [songs, setSongs] = useState([]);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ALBUMS
  const [albums, setAlbums] = useState([]);



  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate('/login');
    } else {
      fetchUserDetails();
    }

    axios.get(`${BACKEND_URL}/api/artists/${id}`)
      .then(response => {
        setArtist(response.data);
      }).catch(error => {
        console.error('There was an error!', error);
      });


    axios.get(`${BACKEND_URL}/api/songs/${id}`)
      .then(response => {
        setSongs(response.data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

    axios.get(`${BACKEND_URL}/api/albums/${id}`, {
    })
      .then(response => {
        setAlbums(response.data);
        //console.log(response.data);
      })
      .catch(error => {
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
                  {artist ? artist.name : 'Loading...'}
                </h1>
              </Row>
              <Row className="p-5">
                <p className="home-page-text">
                  ARTIST ALBUMS
                </p>
                <div className="artist-album-list ">
                  {albums.map((album, index) => (
                    <ArtistAlbumItem key={index} album={album} />
                  ))}
                </div>

                <p className="home-page-text mt-3">
                  ARITST SONGS
                </p>
                <Stack direction="vertical" className="song-item-container p-3 mb-5" gap={1}>
                  {songs.length === 0 ? (
                    <SyncLoader
                      color={color}
                      loading={loading}
                      cssOverride={override}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    songs.map((song, index) => (
                      <Row key={index} className="song-item p-3" onClick={() => {
                        const songUrl = `${BACKEND_URL}/api/play/${song.hashed_name}`;
                        fetch(songUrl)
                          .then(response => response.blob())
                          .then(blob => {
                            const audioBlobURL = URL.createObjectURL(blob);
                            handlePlayerSongChange(audioBlobURL);
                            handlePlayerSongNameChange(song.display_name);
                          });
                      }}>
                        <Col xs={1}>
                          {index + 1}
                        </Col>
                        <Col>
                          {song.display_name}
                        </Col>
                      </Row>
                    ))
                  )}
                </Stack>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default ArtistPage;
