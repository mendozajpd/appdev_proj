import React, { useState, useEffect } from 'react';
import { Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';
import BACKEND_URL from '../config';

const MusicPlayer = ({ songID }) => {

    const navigate = useNavigate();

    const [songDetails, setSongDetails] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);

    const handleSongDetails = (song) => {
        setSongDetails(song);
    }

    const handleCurrentSong = (song) => {
        setCurrentSong(song);
    }

    useEffect(() => {
        if (songID) {
            playSong(songID);
        }
    }, [songID]);

    const playSong = async (songID) => {
        try {
            axios.get(`${BACKEND_URL}/api/song-details/${songID}`)
                .then(response => {
                    handleSongDetails(response.data);
                    const songUrl = `${BACKEND_URL}/api/play/${response.data.hashed_name}`;
                    fetch(songUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            const audioBlobURL = URL.createObjectURL(blob);
                            handleCurrentSong(audioBlobURL);
                        });
                })
        } catch (error) {
            console.error('Failed to fetch song:', error);
        }
    };


    return (
        <div className="position-relative flex-grow-1 d-flex">
            <div className="user-player-bar d-flex position-fixed bottom-0 w-100 flex-grow-1">
                <Col xs={2} className="d-flex align-items-center p-3 flex-direction-column">
                    {songDetails && (
                        <>
                            <div>
                                <Image src={`${BACKEND_URL}/storage/album_images/${songDetails.album.cover_photo_hash}`} alt="Album Cover" style={{ width: '50px', height: '50px' }} rounded />
                            </div>
                            <div>
                                <div className="player-song-title d-flex align-items-center px-2 text-truncate">{songDetails.display_name}</div>
                                <div className="player-song-author  px-2 text-truncate" onClick={() => navigate(`/artist/${songDetails.user.id}`)}>{songDetails.user.name}</div>
                            </div>
                        </>
                    )}
                </Col>
                <Col xs={6}>
                    <AudioPlayer src={currentSong} showDownloadProgress={false} showSkipControls={true} showJumpControls={false} autoPlay className='user-player h-100' />
                </Col>
                <Col xs={2}>
                    {/* <h1>Settings</h1> */}
                </Col>
                <Col xs={2} className="invisible-text">
                    extra space (bad practice, but it works for now)
                </Col>
            </div>
        </div>
    );
}

export default MusicPlayer;