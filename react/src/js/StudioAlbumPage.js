import React, { useMemo, useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Dropdown, Col, FormControl } from "react-bootstrap";
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


// MEDIADROPZONE
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';



const StudioAlbumPage = () => {
  const [isVerified, setIsVerified] = useState(false);

  const { id } = useParams();

  // SONGS
  const [songs, setSongs] = useState([]);

  // ALBUM
  const [album, setAlbum] = useState([]);

  // MODAL
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // FILES

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

  // CREATE ALBUM BUTTON
  const [isCreateAlbumButtonDisabled, setIsCreateAlbumButtonDisabled] = useState(false);

  // Modal Pages
  const [uploadStep, setUploadStep] = useState(0);

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

  // MEDIA DROPZONE
  const [files, setFiles] = useState([]);
  const [editing, setEditing] = useState(null);
  const [fileName, setFileName] = useState('');
  const [options, setOptions] = useState([]);
  // const [selectedGenres, setSelectedGenres] = useState({});
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [playingFile, setPlayingFile] = useState(null);
  const playerRefs = useRef({});

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    accept: 'audio/mp3',
    onDrop: acceptedFiles => {
      const newFiles = [...songs, ...acceptedFiles.map(file => Object.assign(file, {
        id: uuidv4(),
        preview: URL.createObjectURL(file),
        formattedSize: (file.size / 1048576).toFixed(2),
        displayName: file.name.split('.').slice(0, -1).join('.'),
        genres: []
      }))];
      setSongs(newFiles);
      handleMediaDrop(newFiles);
      console.log('newfiles', newFiles);
    }
  });

  const handleBlur = () => {
    setEditing(null);
  };

  const handleFileNameChange = (e, index) => {
    const newDisplayName = e.target.value;
    let newFiles = [...files];
    newFiles[index].displayName = newDisplayName;
    setFiles(newFiles);
  };

  const removeFile = file => (event) => {
    event.stopPropagation();
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter(f => f.id !== file.id);
      if (newFiles.length === 0) {
        localStorage.removeItem('files');
      } else {
        localStorage.setItem('files', JSON.stringify(newFiles));
      }
      return newFiles;
    });

    handleFileDelete(file);
  };

  const filesView = songs.map((file, index) => (
    <React.Fragment key={file.id} >
      <Row className="mb-2 files-view" onClick={(e) => e.stopPropagation()}>
        <Col className='d-flex flex-column justify-content-start'>
          <Row className='d-flex flex-nowrap'>
            <Col xs={1} className='d-flex justify-content-start mb-2 align-items-center'>
              {index + 1}
            </Col>
            <Col xs={6} className='d-flex align-items-end flex-column'>
              <Row className='w-100'>
                <FormControl
                  value={file.display_name}
                  onChange={(event) => handleFileNameChange(event, index)}
                  onBlur={handleBlur}
                  className='input-style'
                  placeholder="Song name"
                />
                {file.isNameEmpty && <div>Song name can't be empty</div>}
              </Row>
              <Row className='w-100'>
                <AudioPlayer
                  ref={c => playerRefs.current[file.path] = c}
                  src={file.preview}
                  layout="horizontal"
                  className='player-borderless'
                  customAdditionalControls={[]}
                  customVolumeControls={[]}
                  showJumpControls={false}
                  onPlay={() => {
                    if (playingFile && playingFile !== file.path && playerRefs.current[playingFile]) {
                      playerRefs.current[playingFile].audio.current.pause();
                    }
                    setPlayingFile(file.path);
                  }}
                />
              </Row>
            </Col>
            <Col xs={4} className='d-flex align-items-center' >
              <Row className='w-100'>
                <Select
                  isMulti
                  styles={selectStyles}
                  closeMenuOnSelect={false}
                  options={options}
                  placeholder='Genre'
                  value={file.genres}
                  // onChange={handleGenreChange(file)}
                  maxMenuHeight={125}
                />
              </Row>
            </Col>
            <Col xs={1} className='d-flex justify-content-center align-items-center'>
              <Button className='fa fa-times p-2 btn-preview-delete' variant='transparent outline-danger' onClick={removeFile(file)} />
            </Col>
          </Row>
          <Row>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  ));

  const filesAddMore = (
    <Row className="mb-2 files-view" style={{ cursor: 'pointer', color: 'gray' }}>
      <Col className='d-flex flex-column justify-content-start'>
        <Row className='d-flex flex-nowrap'>
          <Col xs={12} className='d-flex justify-content-center align-items-center'>
            <i className="fa fa-plus-square px-2" aria-hidden="true" />
            Add more songs here
          </Col>
        </Row>
      </Col>
    </Row>
  );

  const activeStyle = {
    borderColor: '#2196f3'
  };

  const acceptStyle = {
    borderColor: '#00e676'
  };

  const style = useMemo(() => ({
    ...(isDragActive ? { ...activeStyle, backgroundColor: 'lightgray' } : {}),
    ...(isDragAccept ? acceptStyle : {}),
  }), [isDragActive, isDragAccept, activeStyle, acceptStyle]);

  const iconStyle = useMemo(() => ({
    fontSize: 70,
    animation: isDragActive ? 'bounce 0.5s infinite' : 'none'
  }), [isDragActive]);

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
                <Button variant="danger" disabled={isCreateAlbumButtonDisabled} onClick={() => { }}>
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
                    <Form onSubmit={''}>
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
                  {/* <MediaDropzone onDrop={handleMediaDrop} onFileDelete={handleFileDelete} onGenreChange={handleGenreChange} iconClass='fa fa-upload' iconSize={70} uploadText='Drag and drop songs here or click to select file/s' uploadTextClass='custom-dropzone-text' /> */}
                  <Container>
                    <Row {...getRootProps({ className: 'dropzone media-dropzone vh-20', style })}>
                      <input {...getInputProps()} />
                      {songs.length === 0 ? (
                        <Col className='d-flex align-items-center justify-content-center p-5 flex-column'>
                          <Row>
                            <i className='fa fa-upload' style={iconStyle} aria-hidden="true" />
                            <Row className='custom-dropzone-text'>
                              Drag and drop songs here or click to select file/s
                            </Row>
                          </Row>
                        </Col>
                      ) : (
                        <Col className='px-3 py-1'>
                          <Row className='justify-content-center align-items-center d-flex flex-grow-1'>
                            {filesView}
                            {filesAddMore}
                          </Row>
                        </Col>
                      )}
                    </Row>
                  </Container>
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

const selectStyles = {
  valueContainer: (base) => ({
    ...base,
    maxHeight: 80,
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#888 #333",
    "::webkit-scrollbar": {
      width: "8px"
    },
    "::webkit-scrollbar-thumb": {
      background: "#888"
    },
    "::webkit-scrollbar-thumb:hover": {
      background: "#555"
    }
  }),

  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  control: base => ({
    ...base,
    backgroundColor: '#333',
    color: 'white'
  }),
  menu: base => ({
    ...base,
    backgroundColor: '#333',
    color: 'white',
    scrollbarWidth: "thin",
    scrollbarColor: "#888 #333",
    "::webkit-scrollbar": {
      width: "8px"
    },
    "::webkit-scrollbar-thumb": {
      background: "#888"
    },
    "::webkit-scrollbar-thumb:hover": {
      background: "#555"
    }
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'black' : 'white',
    backgroundColor: state.isSelected ? 'gray' : '#333',
    "&:hover": {
      backgroundColor: '#555'
    }
  }),
  input: (provided, state) => ({
    ...provided,
    color: 'white',
  }),
};

export default StudioAlbumPage;
