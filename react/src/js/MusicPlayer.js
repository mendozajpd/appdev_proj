import React, { useState, useEffect, useContext } from 'react';
import { Col, Image, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';
import BACKEND_URL from '../config';
import vid from '../temp/Download.mp4';

import PlayerContext from "./context/PlayerContext";


const MusicPlayer = () => {

    const { queue, currentQueue, setCurrentQueue, playingViewActive, setPlayingViewActive, setTimeOnPlay, isPlaying, setIsPlaying} = useContext(PlayerContext);

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
            resetSongListened();
        }
    }

    const handlePreviousSong = () => {
        if (currentQueue > 0) {
            setCurrentQueue(currentQueue - 1);
            resetSongListened();
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


    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    // SONG LISTENED

    const [songListened, setSongListened] = useState(false);
    const [songListenedCount, setSongListenedCount] = useState(0);

    const handleSongListened = () => {
        if (!songListened) {
            console.log('Song listened', queue[currentQueue]);
            axios.post(`${BACKEND_URL}/api/listen/${queue[currentQueue].id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
                },

            })
                .then(response => {
                    console.log('Song listened', response.data);
                    setSongListened(true);
                });
        }
    }

    const resetSongListened = () => {
        setSongListened(false);
        setSongListenedCount(0);
    }

    return (
        <div className="position-relative flex-grow-1 d-flex">
            <div className="user-player-bar d-flex position-fixed bottom-0 w-100 flex-grow-1">
                <Col xs={2} className="d-flex align-items-center p-3 flex-direction-column">
                    {songDetails && (
                        <>
                            <div>
                                <Image src={`${BACKEND_URL}/storage/album_images/${songDetails.album.cover_photo_hash}`} alt="Album Cover" style={{ width: '50px', height: '50px' }} rounded />
                                {/* <ReactPlayer light={<img src='https://example.com/thumbnail.png' alt='Thumbnail' />} /> */}
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
                        onPlay={(time) => {handlePlay(); setTimeOnPlay(time.target.currentTime);}}
                        onSeeked={(time) => {setTimeOnPlay(time.target.currentTime)}}
                        onPause={(time) => {handlePause(); setTimeOnPlay(time.target.currentTime)}}
                        onEnded={handleNextSong}
                        showDownloadProgress={false}
                        showSkipControls={true}
                        showJumpControls={false}
                        autoPlay
                        className='user-player h-100'
                        onClickNext={handleNextSong}
                        onClickPrevious={handlePreviousSong}
                        listenInterval={1000}
                        onListen={(time) => {
                            if (isPlaying) {
                                setSongListenedCount(songListenedCount + 1);
                                // setCurrentTime(time.target.currentTime)
                                // console.log('Current time:', time.target.currentTime);
                                if (songListenedCount >= 5) {
                                    handleSongListened();
                                }
                            }
                        }}
                    />
                </Col>
                <Col xs={2} className='d-flex align-items-center px-5 gap-2'>
                    <div>

                        {location.pathname === '/queue' ? (
                            <div className='p-1 icon-border-active'>
                                <i className="fa fa-bars  icon-click icon-active" onClick={() => navigateBack()}></i>
                            </div>
                        ) : (
                            <div className='p-1'>
                                <i className="fa fa-bars  icon-click icon-hover-white" onClick={() => navigateToQueue()}></i>
                            </div>
                        )}
                    </div>
                    <div>
                        {playingViewActive ? (
                            <div className='m-1'>
                                <i className="fa fa-play icon-click icon-small icon-active p-1 icon-border-active" onClick={() => setPlayingViewActive(false)}></i>
                            </div>
                        ) : (
                            <div className='p-1'>
                                <i className="fa fa-play icon-click icon-small icon-hover-white p-1" style={{border: '1px solid white', borderRadius:'5px'}} onClick={() => setPlayingViewActive(true)}></i>
                            </div>
                        )}
                    </div>
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