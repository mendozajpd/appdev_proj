import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Stack } from "react-bootstrap";
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
  const [albumTitle, setAlbumTitle] = useState('');
  const [artistNames, setArtistNames] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [albumPhoto, setAlbumPhoto] = useState(null);
  const [songTitle, setSongTitle] = useState('');
  const [songFile, setSongFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState({});

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
        console.log(response.data);
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
      upload_success(response.data.message);
    } catch (error) {
      upload_failed(error.response.data.message);
      console.error('There was an error!', error);
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
    console.log(acceptedFiles[0].name);
  };

  const handleMediaDrop = (acceptedFiles) => {
    setMediaFiles(acceptedFiles);
    acceptedFiles.forEach(file => {
      console.log(file.name);
    });
  };

  const handleGenreChange = (selectedGenres) => {
    setSelectedGenres(selectedGenres);
  };


  const handleCreateAlbum = async (e) => {
    e.preventDefault();

    console.log(selectedGenres);
    console.log(mediaFiles);
    
    const formData = new FormData();
    formData.append('album_name', albumTitle);
    formData.append('album_description', albumDescription);
    formData.append('album_photo', albumPhoto);
    formData.append('is_published', 0); // or false, depending on your requirements
    // formData.append('release_date', releaseDate); // if you have a release date field


    // Add each song file to the form data
    mediaFiles.forEach((file, index) => {
      formData.append(`songs[${index}]`, file);
      formData.append(`displayNames[${index}]`, file.displayName);
      const genres = selectedGenres[file.path] || [];
      if (genres.length === 0) {
        upload_failed(`The song ${file.name} does not have a genre.`);
        return;
      }
      genres.forEach((genre, genreIndex) => {
        formData.append(`genres[${index}][${genreIndex}]`, genre.value);
      });
    });

    console.log(mediaFiles);
    const token = localStorage.getItem("jwt_token");

    try {
      const response = await axios.post(`${BACKEND_URL}/create/album/upload-songs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      upload_success(response.data.message);
      handleClose();
      resetUpload();
    } catch (error) {
      upload_failed(error.response.data.message);
      console.error('There was an error!', error);
    }
  };

  return (
    <>
      <div className="home-page d-flex vh-100">
        <UserSidebar />
        <Modal className="upload-modal" show={show} size='lg' onHide={handleClose} backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <div className="p-3">
            <Modal.Header closeButton>
              <Modal.Title>Create Album</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {uploadStep === 0 ? (
                <>
                  <Row className='py-3 d-flex px-3' style={{ borderBottom: '1px solid #B93B3B' }}>
                    <Col className="d-flex align-items-center justify-content-center py-2">
                      <Row className="album-cover-preview d-flex justify-content-center">
                        <AlbumCoverDropzone onDrop={handleAlbumCoverDrop} iconClass='fa fa-picture-o' iconSize={60} uploadText='Drag and drop album cover image here or click to select file' uploadTextClass='custom-dropzone-text' />
                      </Row>
                    </Col>
                    <Col xs={12} sm={12} xl={7}>
                      <Form onSubmit={handleCreateAlbum}>
                        <Stack direction="vertical" className="px-3" gap={1}>
                          <Form.Group controlId="album_name">
                            {/* <Form.Label>Album Title</Form.Label> */}
                            <Form.Control className="input-style" type="text" placeholder="Album title" value={albumTitle} onChange={e => setAlbumTitle(e.target.value)} />
                          </Form.Group>
                          <Form.Group controlId="album_description">
                            {/* <Form.Label>Album Description</Form.Label> */}
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
                    {/* <Col>
                      nice
                    </Col> */}
                    <Col className="d-flex justify-content-center flex-column">
                      {/* <Row>
                        ADD SONGS
                      </Row> */}
                      <Row>
                        <MediaDropzone onDrop={handleMediaDrop} onGenreChange={handleGenreChange} iconClass='fa fa-upload' iconSize={70} uploadText='Drag and drop album cover image here or click to select file' uploadTextClass='custom-dropzone-text' />
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
            <Modal.Footer>
              {uploadStep > 0 && (
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              )}
              {uploadStep < 2 ? (
                <>
                  <Button variant="danger" onClick={handleCreateAlbum}>
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
        </Modal>
        <Container className="home-page-content" fluid>
          <Row className="">
            <Col className="p-5 ">
              <Row className="mb-5">
                <Col xs={4}>
                  <Row>
                    <div className="search-bar d-flex align-items-center">
                      <i className="fa fa-search" aria-hidden="true" />
                      <Form.Control className="search-bar-input" placeholder="Search" />
                    </div>
                  </Row>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button className="btn-danger" onClick={() => { handleShow(); resetUpload(); }}>
                    <i className="fa fa-plus-square px-2" aria-hidden="true" />
                    CREATE
                  </Button>
                </Col>
              </Row>
              <Row>
                <h1 className="home-page-text mb-5">
                  Artist content
                </h1>
              </Row>
              <Row>
                <h3 className="home-page-text mb-3">
                  Albums
                </h3>
              </Row>
              <Row className="p-2 album-container-header">
                <Col className="justify-content-center d-flex align-items-center" xs={1}>
                  <Form.Check />
                </Col>
                <Col>
                  Album Cover
                </Col>
                <Col className="d-flex align-items-center justify-content-start">
                  Title
                </Col>
                <Col xs={3} className='d-flex align-items-center'>
                  Description
                </Col>
                <Col className="d-flex align-items-center">
                  Date
                </Col>
                <Col className="d-flex align-items-center">
                  Status
                </Col>
                <Col className="d-flex align-items-center">
                  {/* {album.listens} */}
                  Listens
                </Col>
                <Col className="d-flex align-items-center">
                  {/* {album.likes} */}
                  Likes
                </Col>
              </Row>
              <Row>
                <Col className="album-item-container">
                  {albums.map((album, index) => (
                    <AlbumItem key={index} album={album} />
                  ))}
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
      <ToastContainer />
    </>
  );
};

export default ArtistPage;
