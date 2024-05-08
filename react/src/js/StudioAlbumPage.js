import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Dropdown, Col, Image, Stack, CloseButton, Card } from "react-bootstrap";
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

import { getAlbumDetails } from "./services/StudioServices";


const StudioAlbumPage = () => {
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

  // ALBUM
  const [album, setAlbum] = useState([]);

  // MODAL
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // FILES

  const handleClose = () => {
    setShow(false);
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

    setAlbumAndSongs();

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

  const setAlbumAndSongs = async () => {
    try {
      const albumDetails = await getAlbumDetails(id);
      setAlbum(albumDetails.album);
      setSongs(albumDetails.songs);

      console.log(albumDetails)
    } catch (error) {
      console.error('Failed to fetch album details:', error);
    }
  }

  const navigate = useNavigate();

  // DROPDOWN
  const [showDropdown, setShowDropdown] = useState(false);

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
            <Modal.Header className="py-3">
              <Modal.Title>Album Details</Modal.Title>
              <div>
                <Button variant="outline-light" className="no-hover" style={{ border: 'none' }}>
                  UNDO CHANGES
                </Button>
                <Button variant="danger" disabled={isCreateAlbumButtonDisabled} onClick={handleCreateAlbum}>
                  SAVE
                </Button>
              </div>
            </Modal.Header>
            <Modal.Body>
              <Row className="gap-2">
                <Col className="">
                  <div className="d-flex justify-content-center py-2">
                    <AlbumCoverDropzone onDrop={handleAlbumCoverDrop} iconClass='fa fa-picture-o' iconSize={60} uploadText='Drag and drop album cover image here or click to select file' uploadTextClass='custom-dropzone-text' />
                  </div>
                  <div>
                    <Form onSubmit={handleCreateAlbum}>
                      <Form.Group controlId="album_name">
                        <Form.Control className="input-style" type="text" placeholder="Album title (Required)" value={albumTitle} onChange={e => setAlbumTitle(e.target.value)} />
                      </Form.Group>
                      <Form.Group controlId="album_description" className="py-2">
                        <Form.Control className="textarea-style input-style" as="textarea" rows={3} placeholder="Description" value={albumDescription} onChange={e => setAlbumDescription(e.target.value)} />
                      </Form.Group>
                      <Form.Group controlId="collaborator_names">
                        <Form.Label>Collaborators</Form.Label>
                        <Form.Control className="input-style" type="text" placeholder="Artist names" value={artistNames} onChange={e => setArtistNames(e.target.value)} />
                      </Form.Group>
                    </Form>
                  </div>
                  <div className="my-2 ">
                    <div>
                      Visibility
                    </div>
                    <Dropdown
                      className="d-inline"
                      autoClose="outside"
                      show={showDropdown}
                      onToggle={(isOpen) => setShowDropdown(isOpen)}
                    >
                      <Dropdown.Toggle className="input-style" id="dropdown-autoclose-outside" style={{ width: '100%' }}>
                        Public
                      </Dropdown.Toggle>
                      <Dropdown.Menu variant="dark" style={{ width: '20rem' }}>
                        <div className="mx-2">
                          <Form>
                            <div key={`default-radio`} className="mb-3">
                              <Form.Check
                                type={'radio'}
                                id={`radio-1`}
                                name={`group`}
                                label={`Unlisted`}
                              />
                              <Form.Check
                                type={'radio'}
                                id={`radio-2`}
                                name={`group`}
                                label={`Public`}
                              />
                            </div>
                          </Form>
                        </div>
                        <div className="px-3 justify-content-end d-flex">
                          <Button
                            variant="outline-light"
                            className="no-hover"
                            style={{ border: 'none' }}
                            onClick={() => setShowDropdown(false)}
                          >
                            Cancel
                          </Button>
                          <Button variant="danger">
                            Save
                          </Button>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Col>
                <Col xs={8} style={{ height: '35rem' }} className="overflow-auto media-dropzone">
                  <MediaDropzone onDrop={handleMediaDrop} onFileDelete={handleFileDelete} onGenreChange={handleGenreChange} iconClass='fa fa-upload' iconSize={70} uploadText='Drag and drop songs here or click to select file/s' uploadTextClass='custom-dropzone-text' />
                </Col>
              </Row>
              <Row className="justify-content-end">
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
              </Row>
            </Modal.Body>
            <Modal.Footer className="justify-content-between">
            </Modal.Footer>
          </div>
        </Container >
      </div >
      <ToastContainer />
    </>
  );
};

export default StudioAlbumPage;
