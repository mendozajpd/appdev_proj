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

// Services
import { getPodcasts } from "./services/StudioServices";


const ArtistDashboard = () => {

  const { id } = useParams();
  const { user } = useContext(StudioContext);

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

  const limit = 999;

  const [mostListenedSong, setMostListenedSong] = useState([]);
  const [mostListenedSongRank, setMostListenedSongRank] = useState([]);
  const [mostListenedArtistRank, setMostListenedArtistRank] = useState([]);
  const [artistListens, setArtistListens] = useState([]);
  const [artistPopulation, setArtistPopulation] = useState([]);
  const [mostListenedSongName, setMostListenedSongName] = useState('')
  const [mostListenedSongAlbumDetails, setMostListenedSongAlbumDetails] = useState([])

  const fetchArtistPopulation = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/artist-count`, {
        headers: {}
      });

      // console.log('Artist Population:', response.data);
      setArtistPopulation(response.data);

    } catch (error) {
      console.error('Failed to fetch artist population:', error);
    }
  }

  const fetchMostListenedSongOfArtist = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/most-listened-song-of-artist/${user.id}/${limit}`, {
        headers: {}
      });

      console.log('Most listened artist song:', response.data.songs[0]);
      const mostListened = response.data.songs[0];
      setMostListenedSong(mostListened);
      setMostListenedSongName(mostListened.song.display_name);

    } catch (error) {
      console.error('Failed to fetch most listened artist song:', error);
    }
  }

  const fetchMostListenedSongRank = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/most-listened-song/${limit}`, {
        headers: {}
      });

      console.log('Most listened song:', response.data);

      // Get Song ID
      const songRank = response.data.songs.findIndex(song => song.song_id === mostListenedSong.song_id);

      // console.log('Song rank:', songRank + 1);

      setMostListenedSongRank(songRank + 1);

    } catch (error) {
      console.error('Failed to fetch most listened song:', error);
    }
  }

  const fetchMostListenedArtistRank = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/most-listened-artist/${limit}`, {
        headers: {}
      });

      const artistRank = response.data.artists.findIndex(artist => artist.user_id === user.id);
      const artist = response.data.artists.filter(artist => artist.user_id === user.id)[0];

      console.log('Artist rank:', artistRank + 1);

      if (artist) {
        setArtistListens(artist.total_listens);
        console.log('waw', artist);
      }

      setMostListenedArtistRank(artistRank + 1);

    } catch (error) {
      console.error('Failed to fetch most listened song:', error);
    }
  }

  const fetchAlbumOfSong = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/song/${mostListenedSong.song_id}/album`, {
        headers: {}
      });

      console.log(response.data);
      setMostListenedSongAlbumDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch album:', error)
    }
  }

  useEffect( () => {
    fetchArtistPopulation();
    fetchMostListenedSongOfArtist();
    fetchMostListenedSongRank();
    fetchMostListenedArtistRank();
    fetchAlbumOfSong();
  }, [user]);

  return (
    <>
      <div className="home-page d-flex vh-100 artist-studio fade-in">

        <Container className="home-page-content mt-4" fluid>
          <Row className="">
            <Col className="px-5 py-3">
              <Row>
                <h4 className="home-page-text px-3">
                  Artist Dashboard
                </h4>
              </Row>
              <Row>
                <Col xs={4} className="">
                  <Card bg="dark" className="mb-1 studio-card" style={{ minWidth: '10rem' }}>
                    <Card.Body>
                      <Card.Title className="text-truncate">Most Listened Song</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                      <Card.Text className="d-flex justify-content-around flex-wrap">
                        {mostListenedSong && mostListenedSong.song_id ? (
                          <>
                            <div className="my-3 align-items-end text-truncate" style={{ minWidth: '100px' }}>
                              <div className="mx-2 justify-content-center d-flex">
                                <Image src={`${BACKEND_URL}/storage/album_images/${mostListenedSongAlbumDetails.cover_photo_hash}`} style={{ width: '100px', height: '100px' }} rounded />
                              </div>
                              <div className="d-flex flex-column justify-content-center">
                                <div className="d-flex justify-content-center">
                                  {/* {mostListenedSong  ? mostListenedSong.song.display_name : 'Loading...'} */}
                                  {mostListenedSongName}
                                </div>
                                <div className="d-flex text-gray text-details justify-content-center">
                                  {/* {mostListenedSong ? (mostListenedSong.song.display_name) : ('Loading...')} */}
                                  {mostListenedSongAlbumDetails.album_name}
                                </div>
                              </div>
                            </div>
                            <div className="mx-3 justify-content-center">
                              <div className="d-flex justify-content-center text-truncate">
                                <h1 className="mb-0 display-1">
                                  {mostListenedSong ? (mostListenedSong.total_listens) : ('Loading...')}

                                </h1>
                              </div>
                              <div className="d-flex align-content-end justify-content-center mx-2 flex-wrap">
                                listens
                              </div>
                            </div>
                            <div className="justify-content-center text-truncate">
                              <div className="d-flex justify-content-center text-truncate">
                                <h1 className="mb-0 display-1">
                                  #{mostListenedSongRank && mostListenedSongRank}
                                </h1>
                              </div>
                              <div className="d-flex align-content-end justify-content-center mx-2">
                                most listened globally
                              </div>
                            </div>
                          </>
                        ) :
                          (
                            <div className="text-gray d-flex" >You don't have a most listened song yet. Please upload a song first.</div>
                          )}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card bg="dark" className="mt-1 studio-card" style={{ minWidth: '10rem' }}>
                    <Card.Body>
                      <Card.Title className="text-truncate">Artist Ranking</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                      <Card.Text className="d-flex flex-wrap">
                        <div className="mx-2 text-truncate">
                          <div className="d-flex align-items-end">
                            <h1 className="display-1">
                              #{mostListenedArtistRank && mostListenedArtistRank}
                            </h1>
                            <div className="my-3 d-flex text-gray text-truncate">
                              of {artistPopulation.artistCount}
                            </div>
                          </div>
                          <div className="d-flex align-items-end text-truncate">
                            <div>
                              most listened artist
                            </div>
                          </div>
                        </div>
                        <div className="mx-2 text-truncate">
                          <div className="d-flex align-items-end">
                            <h1 className="display-1">
                              {artistListens}
                            </h1>
                          </div>
                          <div className="d-flex align-items-end text-truncate">
                            <div>
                              total listens
                            </div>
                          </div>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card bg='dark' className="studio-card h-100" style={{ minWidth: '20rem' }}>
                    <Card.Body>
                      <Card.Title>Show Data Here</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                      <Card.Text>
                        Wow this is some good data. :O
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default ArtistDashboard;
