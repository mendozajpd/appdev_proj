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
import PlaylistUpdateContext from "./context/PlaylistUpdateContext";
import PlaylistSongsContext from "./context/PlaylistSongsContext";
import UserSidebarContext from "./context/UserSidebarContext";


const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const QueuePage = () => {

  const [isVerified, setIsVerified] = useState(false);

  const [playlist, setPlaylist] = useState(null);
  const [author, setAuthor] = useState('');
  const { id } = useParams();

  // MODAL FOR EMAIL VERIFICATION
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // MODAL FOR ADDING SONGS TO PLAYLIST
  const [showAddSongs, setShowSongs] = useState(false);
  const handleCloseSongs = () => setShowSongs(false);
  const handleShowSongs = () => setShowSongs(true);

  // MODAL FOR DELETING PLAYLIST
  const [showDeletePlaylist, setShowDeletePlaylist] = useState(false);
  // const [isEnableDelete, setEnableDelete] = useState(true);
  const handleCloseDelete = () => setShowDeletePlaylist(false);
  const handleShowDelete = () => setShowDeletePlaylist(true);

  // PLAYLIST
  const [playlistUpdate, setPlaylistUpdate] = useState(false);
  const [songs, setSongs] = useState([]);

  // Refresh sidebar
  const { setRefreshSidebar } = useContext(UserSidebarContext);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate('/login');
    } else {
      // fetchUserDetails();
    }


  }, [id, isVerified]);

  const navigate = useNavigate();


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
            <CloseButton onClick={handleCloseSongs} variant="white" />
          </Modal.Header>
          <Modal.Body>
            <Container>
              <PlaylistSongsContext.Provider value={{ songs, setSongs }}>
                <PlaylistUpdateContext.Provider value={{ playlistUpdate, setPlaylistUpdate }}>
                  <AddSongsToPlaylistTable />
                </PlaylistUpdateContext.Provider>
              </PlaylistSongsContext.Provider>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleCloseSongs}>
              Done
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal className="upload-modal" onHide={handleCloseDelete} show={showDeletePlaylist} static backdrop="static"
          centered>
          <Modal.Header>
            <Modal.Title>Delete Playlist?</Modal.Title>
            <CloseButton onClick={handleCloseDelete} variant="white" />
          </Modal.Header>
          <Modal.Body>
            <Container>
              <p className="d-flex align-content-center text-truncate">
                <div className="text-nowrap">
                  This will delete
                </div>
                <div className="d-flex align-content-center text-nowrap mx-2">
                  <strong>
                    {playlist ? playlist.name : 'Loading...'}
                  </strong>
                </div>
                PERMANENTLY.
              </p>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => console.log('waw')}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>


        <Container className="home-page-content" fluid>
          <Row className="h-100 overflow-hidden">
            <Col className="vh-100 overflow-auto mb-5 custom-scrollbar">
              <Row className="px-5 pt-5 pb-3 d-flex flex-row">
                <h1 className="text-white">
                  Queue
                </h1>
              </Row>
              <Row className="px-5">
                <h5 className="text-gray">
                  Now Playing
                </h5>
                {/* <PlaylistSongsContext.Provider value={{ songs, setSongs }}>
                  <PlaylistUpdateContext.Provider value={{ playlistUpdate, setPlaylistUpdate }}>
                    <PlaylistSongsTable />
                  </PlaylistUpdateContext.Provider>
                </PlaylistSongsContext.Provider> */}
              </Row>
              <Row className="px-5 py-5">
                <h5 className="text-gray">
                  Next Up
                </h5>
                {/* <PlaylistSongsContext.Provider value={{ songs, setSongs }}>
                  <PlaylistUpdateContext.Provider value={{ playlistUpdate, setPlaylistUpdate }}>
                    <PlaylistSongsTable />
                  </PlaylistUpdateContext.Provider>
                </PlaylistSongsContext.Provider> */}
              </Row>

              <div className="px-5 h-100">
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default QueuePage;
