import React from 'react';
import { Col, Image } from 'react-bootstrap';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MusicPlayer = ({ currentSong, currentSongName }) => {
    return (
        <div className="position-relative flex-grow-1 d-flex">
            <div className="user-player-bar d-flex position-fixed bottom-0 w-100 flex-grow-1">
                <Col xs={2} className="d-flex align-items-center p-3 flex-direction-column">
                    {currentSongName && (
                        <>
                            <Image src="https://via.placeholder.com/50" rounded />
                            <div>
                                <div className="player-song-title d-flex align-items-center px-2 text-truncate">{currentSongName}</div>
                                <div className="player-song-author  px-2 text-truncate">{currentSongName}</div>
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