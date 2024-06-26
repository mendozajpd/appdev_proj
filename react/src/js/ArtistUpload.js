import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Stack, CloseButton, Card } from "react-bootstrap";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import BACKEND_URL from "../config";
import UserSidebar from "./UserSidebar";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import AlbumCoverDropzone from './components/AlbumCoverDropzone';
import MediaDropzone from './components/MediaDropzone';
import { ToastContainer, toast, Bounce, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlbumItem from './items/AlbumItem';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// TEMP DATATABLE
import { AlbumsTable } from './tables/AlbumsTable';
import { SongsTable } from './tables/SongsTable';


// Context
import StudioContext from "./context/StudioContext";


const ArtistUpload = () => {
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleClose = () => {
    const files = localStorage.getItem('files');
    localStorage.removeItem('showUpload');
    setShowUpload(false);
    if (files) {
      setShowConfirm(true);
    } else {
      setShow(false);
    }
  };
  const handleShow = () => setShow(true);

  // FILES
  const [albumTitle, setAlbumTitle] = useState('');
  const [artistNames, setArtistNames] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [albumPhoto, setAlbumPhoto] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [songFile, setSongFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState({});

  // CREATE ALBUM BUTTON
  const [isCreateAlbumButtonDisabled, setIsCreateAlbumButtonDisabled] = useState(false);

  // TOASTIFY 
  const upload_success = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      onClose: () => {
        // window.location.reload();
      }
    });
  }

  // Modal Pages
  const [uploadStep, setUploadStep] = useState(0);

  const upload_failed = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      onClose: () => {
        localStorage.setItem('justRegistered', 'false');
      }
    });
  }

  useEffect(() => {
    const showUpload = localStorage.getItem("showUpload");
    if (showUpload === 'true') {
      handleShow();
      localStorage.removeItem("showUpload");
    }

    const token = localStorage.getItem("jwt_token");
    const handleBeforeUnload = (e) => {
      const files = localStorage.getItem('files');
      if (files) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    if (!token) {
      navigate('/login');
    } else {
      fetchUserDetails();
    }



    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [showUpload, id, isVerified]);


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

  // Modal page handlers
  const resetUpload = () => {
    setUploadStep(0);
    setAlbumTitle('');
    setArtistNames('');
    setAlbumDescription('');
    setAlbumPhoto(null);
    setSongTitle('');
    setSongFile(null);
    setSelectedAlbum('');
    setSelectedGenres({});
  };

  const handleContinue = () => {
    setUploadStep(uploadStep + 1); // Add this function
  };

  const handleBack = () => {
    setUploadStep(uploadStep - 1); // Add this function
  };

  // Dropzone
  const handleAlbumCoverDrop = (acceptedFiles) => {
    setAlbumPhoto(acceptedFiles[0]);
    //console.log(acceptedFiles[0].name);
  };

  const handleMediaDrop = (acceptedFiles) => {
    setMediaFiles(acceptedFiles);
    acceptedFiles.forEach(file => {
      //console.log(file.name);
    });
  };

  const handleGenreChange = (selectedGenres) => {
    setSelectedGenres(selectedGenres);
  };

  const handleFileDelete = (fileToDelete) => {
    const newMediaFiles = mediaFiles.filter(file => file !== fileToDelete);
    setMediaFiles(newMediaFiles);
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    setIsCreateAlbumButtonDisabled(true);

    if (!albumTitle) {
      upload_failed('Album title is missing.');
      setIsCreateAlbumButtonDisabled(false);
      return;
    }
    if (!albumDescription) {
      upload_failed('Album description is missing.');
      setIsCreateAlbumButtonDisabled(false);
      return;
    }
    if (!albumPhoto) {
      upload_failed('Album photo is missing.');
      setIsCreateAlbumButtonDisabled(false);
      return;
    }

    if (mediaFiles.length === 0) {
      upload_failed('No songs uploaded. Please upload at least one song.');
      setIsCreateAlbumButtonDisabled(false);
      return;
    }

    for (let file of mediaFiles) {
      if (!file.displayName) {
        upload_failed('Song title is missing.');
        setIsCreateAlbumButtonDisabled(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('album_name', albumTitle);
    formData.append('album_description', albumDescription);
    formData.append('album_photo', albumPhoto);
    formData.append('is_published', 0);
    // formData.append('release_date', releaseDate); 

    mediaFiles.forEach((file, index) => {
      formData.append(`songs[${index}]`, file);
      formData.append(`displayNames[${index}]`, file.displayName);
      const genres = selectedGenres[file.path] || [];
      if (genres.length === 0) {
        upload_failed(`The song ${file.name} does not have a genre.`);
        setIsCreateAlbumButtonDisabled(false);
        return;
      }
      genres.forEach((genre, genreIndex) => {
        formData.append(`genres[${index}][${genreIndex}]`, genre.value);
      });
    });

    const token = localStorage.getItem("jwt_token");


    try {
      const response = await axios.post(`${BACKEND_URL}/api/create/album/upload-songs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      //console.log(response.data);
      upload_success(response.data.message);
      localStorage.removeItem('files');
      handleClose();
      resetUpload();
    } catch (error) {
      upload_failed(error.response.data.message);
      setIsCreateAlbumButtonDisabled(false);
      console.error('There was an error!', error);
    }
  };

  return (
    <>
      <div className="home-page d-flex vh-100 artist-studio fade-in">

        <Container className="home-page-content mt-4" fluid>
          <div className="p-3 text-white">
            <Modal.Header>
              <Modal.Title>Upload Music</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {uploadStep === 0 ? (
                <>
                  <Row className='py-3 d-flex px-3 bot-line' >
                    <Col className="d-flex align-items-center justify-content-center py-2">
                      <Row className="album-cover-preview d-flex justify-content-center">
                        <AlbumCoverDropzone onDrop={handleAlbumCoverDrop} iconClass='fa fa-picture-o' iconSize={60} uploadText='Drag and drop album cover image here or click to select file' uploadTextClass='custom-dropzone-text' />
                      </Row>
                    </Col>
                    <Col xs={12} sm={12} xl={7}>
                      <Form onSubmit={handleCreateAlbum}>
                        <Stack direction="vertical" className="px-3" gap={1}>
                          <Form.Group controlId="album_name">
                            <Form.Control className="input-style" type="text" placeholder="Album title" value={albumTitle} onChange={e => setAlbumTitle(e.target.value)} />
                          </Form.Group>
                          <Form.Group controlId="album_description">
                            <Form.Control className="textarea-style input-style" as="textarea" rows={3} placeholder="Description" value={albumDescription} onChange={e => setAlbumDescription(e.target.value)} />
                          </Form.Group>
                          <Form.Group controlId="collaborator_names">
                            <Form.Label>Collaborators</Form.Label>
                            <Form.Control className="input-style" type="text" placeholder="Artist names" value={artistNames} onChange={e => setArtistNames(e.target.value)} />
                          </Form.Group>
                        </Stack>
                      </Form>
                    </Col>
                  </Row>
                  <Row className="d-flex justify-content-center py-3">
                    <Col className="d-flex justify-content-center flex-column">
                      <Row>
                        <MediaDropzone onDrop={handleMediaDrop} onFileDelete={handleFileDelete} onGenreChange={handleGenreChange} iconClass='fa fa-upload' iconSize={70} uploadText='Drag and drop songs here or click to select file/s' uploadTextClass='custom-dropzone-text' />
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : uploadStep === 1 ? (
                <div>Page 1 (prevButton, nextButton)</div>
              ) : uploadStep === 2 ? (
                <div>Page 2 (prevButton)</div>
              ) : ''}
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
              {mediaFiles.length > 0 ? (
                <>
                  {mediaFiles.length == 1 ? (
                    <>
                      {mediaFiles.length} Song uploaded
                    </>
                  ) :
                    (
                      <>
                        {mediaFiles.length} Songs uploaded
                      </>
                    )}
                </>
              ) : (
                <>
                  No Songs uploaded
                </>
              )}
              {uploadStep > 0 && (
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              )}
              {uploadStep < 2 ? (
                <>
                  <Button variant="danger" disabled={isCreateAlbumButtonDisabled} onClick={handleCreateAlbum}>
                    Create Album
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={handleClose}>
                  Ok
                </Button>
              )}
            </Modal.Footer>
          </div>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default ArtistUpload;
