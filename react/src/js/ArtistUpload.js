import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Stack } from "react-bootstrap";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import BACKEND_URL from "../config";
import UserSidebar from "./UserSidebar";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { SongsTable } from "./tables/SongsTable";

const ArtistPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [logoutDisabled, setLogoutDisabled] = useState(false);

  const [artist, setArtist] = useState(null);
  const { id } = useParams();

  // Player
  const [currentSong, setCurrentSong] = useState(null);
  const playerRef = useRef();

  // SONGS
  const [songs, setSongs] = useState([]);

  // ALBUMS
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // FILES
  const [songTitle, setSongTitle] = useState('');
  const [songFile, setSongFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate('/login');
    } else {
      fetchUserDetails();
    }

    axios.get(`${BACKEND_URL}/albums`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setAlbums(response.data);
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
      const response = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data; // Assuming user details are directly in response.data
      console.log(userData);
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
      const userDetailsResponse = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userDetailsResponse.data;
      const response = await axios.post(
        `${BACKEND_URL}/resend-verification-email`,
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
      console.log(response.data);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('display_name', songTitle);
    formData.append('song', songFile);
    formData.append('album_id', selectedAlbum);
  
    const token = localStorage.getItem("jwt_token");
  
    try {
      const response = await axios.post(`${BACKEND_URL}/upload-song`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };



  return (
    <>
      <div className="home-page d-flex vh-100">
        <UserSidebar />
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
          <Row className="h-100">
            <Col className="p-5">
              <Row className="mb-5">
                <Form.Control className="search-bar" placeholder="Search" />
              </Row>
              <h1 className="home-page-text mb-5">
                Upload Song
              </h1>


              <Form onSubmit={handleSubmit}>
                <Stack direction="vertical" className="song-item-container p-3" gap={1}>
                  <Form.Group controlId="songTitle">
                    <Form.Label className="home-page-text">Song Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter song title" value={songTitle} onChange={e => setSongTitle(e.target.value)} />
                  </Form.Group>

                  <Form.Group controlId="songFile" className="mb-4">
                    <Form.Label className="home-page-text">Song File</Form.Label>
                    <Form.Control type="file" onChange={e => setSongFile(e.target.files[0])} />
                  </Form.Group>

                  <Form.Group controlId="album">
                    <Form.Label>Album</Form.Label>
                    <Form.Control as="select" onChange={e => setSelectedAlbum(e.target.value)}>
                      <option>Choose an existing album</option>
                      {albums.map(album => (
                        <option key={album.album_id} value={album.album_id}>{album.album_name}</option>
                      ))}
                    </Form.Control>

                  </Form.Group>

                  <Button variant="danger" type="submit">
                    Upload
                  </Button>
                </Stack>
              </Form>

            </Col>
            <Col xs={4} className="right-sidebar">
              <Row className="p-5">
                <Col>
                  <div className="text-center text-white">
                    <h1 style={{ marginTop: "30px" }}>
                      Welcome to
                      <span
                        style={{
                          marginLeft: "10px",
                          color: "red",
                          transition: "color 0.3s",
                          cursor: "text"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "red";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "white";
                        }}
                      >
                        MEDIAHARBOR
                      </span>
                    </h1>
                  </div>

                  {/* IF NOT VERIFIED */}
                  {!isVerified ? (
                    <>
                      <Button
                        variant="primary"
                        className="login-button btn-block"
                        style={buttonStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleSendVerify}
                        disabled={isButtonDisabled}
                      >
                        Send Verification Email
                      </Button>
                      {isButtonDisabled && <p>Next email can be sent in {remainingTime} seconds</p>}
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <h1 style={{ marginTop: "30px" }}>
                        <span
                          style={{
                            marginLeft: "10px",
                            color: "red",
                            transition: "color 0.3s",
                            cursor: "text"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = "red";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = "white";
                          }}
                        >
                          YOU'RE VERIFIED!
                        </span>
                      </h1>
                    </div>
                  )}
                  <div className="line"></div>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="position-relative flex-grow-1 d-flex">
            <div className="user-player-bar d-flex position-fixed bottom-0 w-100 flex-grow-1">
              <Col xs={2}>
                {/* <h1>Now Playing</h1> */}
              </Col>
              <Col xs={6}>
                <AudioPlayer ref={playerRef} src={currentSong} autoPlay onPlay={e => console.log("onPlay")} className='user-player h-100' />
              </Col>
              <Col xs={2}>
                {/* <h1>Settings</h1> */}
              </Col>
              <Col xs={2} className="invisible-text">
                extra space (bad practice, but it works for now)
              </Col>
            </div>
          </div>
        </Container>

      </div>
    </>
  );
};

export default ArtistPage;
