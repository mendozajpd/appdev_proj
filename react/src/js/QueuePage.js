import React, { useState, useEffect, useRef, CSSProperties, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CloseButton, Button, Container, Row, Col, Image, Stack, Dropdown } from "react-bootstrap";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import BACKEND_URL from "../config";
import 'react-h5-audio-player/lib/styles.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Table
import { QueueTable } from "./tables/QueueTable";

// Context
import PlayerContext from "./context/PlayerContext";
import PlaylistSongsContext from "./context/PlaylistSongsContext";
import UserSidebarContext from "./context/UserSidebarContext";


const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const QueuePage = () => {

  const [isVerified, setIsVerified] = useState(false);

  const { id } = useParams();

  // MODAL FOR EMAIL VERIFICATION
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {

  }, [id, isVerified]);



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
                <QueueTable />
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
