import React, { useState, useEffect, useContext } from 'react';
import { Col, Image, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';
import BACKEND_URL from '../config';

import PlayerContext from "./context/PlayerContext";


const MusicPlayer = () => {

    const { queue, currentQueue, setCurrentQueue } = useContext(PlayerContext);

    const navigate = useNavigate();
    const location = useLocation();

    const [history, setHistory] = useState(null);
    const [songDetails, setSongDetails] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);

    const handleSongDetails = (song) => {
        setSongDetails(song);
    }

    const handleCurrentSong = (song) => {
        setCurrentSong(song);
    }

    useEffect(() => {
        playSong();
    }, [currentQueue]);

    const handleNextSong = () => {
        if (currentQueue < queue.length - 1) {
            setCurrentQueue(currentQueue + 1);
        }
    }

    const handlePreviousSong = () => {
        if (currentQueue > 0) {
            setCurrentQueue(currentQueue - 1);
        }
    }

    const navigateBack = () => {
        console.log('Navigating back to:', history);
        navigate(history);
        setHistory('');
    };

    const navigateToQueue = () => {
        console.log('Navigating to queue from:', location.pathname)
        setHistory(location.pathname);
        navigate('/queue');
    };

    const playSong = async () => {
        if (queue.length === 0) {
            console.log('No songs in queue');
            return;
        }

        const songID = queue[currentQueue].id;
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

    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
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
                                <div className="player-song-author d-inline px-2 text-truncate" onClick={() => navigate(`/artist/${songDetails.user.id}`)}>{songDetails.user.name}</div>
                            </div>
                        </>
                    )}
                </Col>
                <Col xs={6}>
                    <AudioPlayer
                        src={currentSong}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onEnded={handleNextSong}
                        showDownloadProgress={false}
                        showSkipControls={true}
                        showJumpControls={false}
                        autoPlay
                        className='user-player h-100'
                        onClickNext={handleNextSong}
                        onClickPrevious={handlePreviousSong}
                        listenInterval={10000}
                        onListen={() => {
                            if (isPlaying) {
                                console.log('listening');
                            }
                        }}
                    />
                </Col>
                <Col xs={2} className='d-flex align-items-center px-5'>
                    {location.pathname === '/queue' ? (
                        <div className='p-1 icon-border-active'>
                            <i className="fa fa-bars  icon-click icon-active" onClick={() => navigateBack()}></i>
                        </div>
                    ) : (
                        <div className='p-1'>
                            <i className="fa fa-bars  icon-click icon-hover-white" onClick={() => navigateToQueue()}></i>
                        </div>
                    )}
                </Col>
                <Col xs={2} className="invisible-text">
                    {/* <Button onClick={setSongsQueue}>
                        Add songs to queue
                    </Button>
                    <Button onClick={resetQueue}>
                        Reset Queue
                    </Button> */}
                    {/* extra space (bad practice, but it works for now) */}
                </Col>
            </div>
        </div>
    );
}

export default MusicPlayer;