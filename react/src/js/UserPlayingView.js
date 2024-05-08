import React, { useContext, useEffect, useState, useRef } from "react";
import { Container, CloseButton, Image, Button } from "react-bootstrap";
import axios from "axios";
import BACKEND_URL from "../config";
import ReactPlayer from 'react-player'
import screenfull from 'screenfull';
import vid from "../temp/Download.mp4"
import music from "../temp/music.mp3"

import PlayerContext from "./context/PlayerContext";

const UserPlayingView = () => {

    const { queue, currentQueue, setPlayingViewActive, isPlaying } = useContext(PlayerContext);

    const [songDetails, setSongDetails] = useState(null);

    const handleSongDetails = (song) => {
        setSongDetails(song);
    }

    const playerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleFullscreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle(playerRef.current.wrapper);
        }
    };

    useEffect(() => {
        if (queue[currentQueue]) {
            const songID = queue[currentQueue].id;

            axios.get(`${BACKEND_URL}/api/song-details/${songID}`)
                .then(response => {
                    handleSongDetails(response.data);
                    console.log(response.data)
                })
        }

        if (screenfull.isEnabled) {
            const handleScreenfullChange = () => {
                setIsFullscreen(screenfull.isFullscreen);
            };

            screenfull.on('change', handleScreenfullChange);

            return () => {
                screenfull.off('change', handleScreenfullChange);
            };
        }
    }, [currentQueue]);

    return (
        <div className="playing-view p-3 overflow-auto" style={{ width: '40rem', minWidth: '20rem' }}>
            <div className="d-flex justify-content-between pb-5">
                <div>
                    Playing View
                </div>
                <CloseButton variant="white" onClick={() => { setPlayingViewActive(false) }} />
            </div>
            {songDetails ? <>
                {/* <div className="py-5 justify-content-center">
                    <Image src={`${BACKEND_URL}/storage/album_images/${songDetails.album.cover_photo_hash}`} alt="Album Cover" style={{ width: '100%', height: '100%' }} />
                    <ReactPlayer url='https://www.youtube.com/watch?v=LXb3EKWsInQ' />
                </div> */}
                {/* <div className="my-5">
                    <Image src="https://via.placeholder.com/400x250" alt="Album Cover" style={{ width: '100%', height: '100%' }} />
                </div> */}
                <div className='player-wrapper my-5 d-flex justify-content-end align-items-'>
                    <ReactPlayer
                        ref={playerRef}
                        className='react-player'
                        url={vid}
                        width='100%'
                        height='100%'
                        controls={isFullscreen}
                        playing
                    />
                </div>
                <div className="d-flex justify-content-end">
                    <Button variant="outline-light" onClick={handleFullscreen}>
                        <i className="fa fa-arrows-alt display-7" />
                    </Button>
                </div>
                <div className="d-flex justify-content-between py-3">
                    <div className="">
                        <div className="display-7 text-truncate" style={{ maxWidth: '15rem' }}>
                            {songDetails.display_name}
                        </div>
                        <div className="text-gray">
                            {songDetails.user.name}
                        </div>
                    </div>
                    <div className="align-items-center d-flex gap-2">
                        <i className="fa fa-plus-circle display-7" />
                        <i className="fa fa-ellipsis-h display-7" />
                    </div>
                </div>
                <div className="playing-view-description p-3">
                    <div>
                        About
                    </div>
                    <div className="text-gray text-truncate-description">
                        {songDetails.album.album_description}
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="py-3 d-flex gap-2">
                            <div>
                                <Image src={`${BACKEND_URL}/storage/album_images/${songDetails.album.cover_photo_hash}`} alt="Album Cover" style={{ width: '50px', height: '50px' }} rounded />
                            </div>
                            <div>
                                <div>
                                    {songDetails.album.album_name}
                                </div>
                                <div className="text-gray">
                                    {songDetails.user.name}
                                </div>
                            </div>
                        </div>
                        <div className="py-3 align-content-center">
                            <div>
                                <Button variant="outline-danger">
                                    Follow
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5">

                </div>
            </>
                : (
                    <div className="h-50  align-items-center justify-content-center d-flex flex-column text-gray">
                        <i className="fa fa-headphones display-1" />
                        <div className="py-3">
                            Wow this looks empty. Play something!
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default UserPlayingView;