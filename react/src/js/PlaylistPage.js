import React, { useState, useEffect, useRef, CSSProperties, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CloseButton, Button, Container, Row, Col, Image, Stack, Dropdown } from "react-bootstrap";
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
import { AddSongsToPlaylistTable } from "./tables/AddSongsToPlaylistTable";

// Context
import PlayerContext from "./context/PlayerContext";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const PlaylistPage = () => {

  const [isVerified, setIsVerified] = useState(false);

  const [playlist, setPlaylist] = useState(null);
  const [author, setAuthor] = useState('');
  const { id } = useParams();

  // SONGS
  const [songs, setSongs] = useState([]);

  // MODAL FOR EMAIL VERIFICATION
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // MODAL FOR ADDING SONGS TO PLAYLIST
  const [showAddSongs, setShowSongs] = useState(false);
  const handleCloseSongs = () => setShowSongs(false);
  const handleShowSongs = () => setShowSongs(true);

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
        console.log(response.data);
        getPlaylistAuthor([response.data.creator_id]);
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

  const getPlaylistAuthor = async ([author_id]) => {
    try {
      axios.get(`${BACKEND_URL}/api/users/${author_id}`)
        .then(response => {
          setAuthor(response.data);
          console.log(response.data);
        }).catch(error => {
          console.error('There was an error!', error);
        });
    } catch (e) {
      console.error('Failed to fetch playlist author:', e);
    }
  }




  return (
    <>
      <div className="home-page d-flex vh-100">
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

        <Modal className="upload-modal" onHide={handleCloseSongs} show={showAddSongs}
          centered size="lg">
          <Modal.Header>
            <Modal.Title>Add Songs to Playlist</Modal.Title>
            <CloseButton onClick={handleCloseSongs} variant="white"/>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <AddSongsToPlaylistTable />
            </Container>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseSongs}>
              Done
            </Button>
          </Modal.Footer>
        </Modal>


        <Container className="home-page-content" fluid>
          <Row className="h-100 overflow-hidden">
            <Col className="vh-100 overflow-auto mb-5 custom-scrollbar">
              <Row className="artist-banner p-5">
                {/* <Form.Control className="search-bar" placeholder="Search" /> */}
                <h1 className="home-page-text h-100 mb-5 d-flex align-items-end">
                  <Image src="https://via.placeholder.com/150" style={{ width: '150px', height: '150px', marginRight: '15px' }} />
                  {playlist ?
                    <div>
                      <p>
                        {playlist.name}
                      </p>
                      <div onClick={() => navigate(`/artist/${author.id}`)} className="playlist-author d-flex align-items-center">
                        <Image src="https://via.placeholder.com/50" style={{ width: '30px', height: '30px', marginRight: '15px' }} roundedCircle/>
                        {author.name}
                      </div>
                    </div>
                    : 'Loading...'}
                </h1>
              </Row>
              <Row className="px-5 py-2 d-flex flex-row">
                <div className="d-flex align-items-center">
                  <i className="fa fa-play text-white bg-danger p-3 rounded-circle" />
                  <div className="mx-3">
                    <i className="fa fa-random text-white p-3 display-6" />
                  </div>
                  <Button variant="outline-light" onClick={handleShowSongs}>
                    <i className="fa fa-plus p-1" />
                    Add Songs
                  </Button>
                  <Dropdown className="profile-dropdown">
                    <Dropdown.Toggle id="dropdown-basic">
                      <i className="fa fa-ellipsis-h display-6" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                      <Dropdown.Item href="/profile">Add to queue</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="/settings">Edit details</Dropdown.Item>
                      <Dropdown.Item href="/profile">Delete playlist</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Row>
              <div fluid className="px-5">
                <PlaylistSongsTable/>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default PlaylistPage;
