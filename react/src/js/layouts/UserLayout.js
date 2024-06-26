import { Outlet, useNavigate } from "react-router-dom";
import { Container, CloseButton, Image, Button } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import MusicPlayer from "../MusicPlayer";
import axios from "axios";
import BACKEND_URL from "../../config";
import UserSidebar from "../UserSidebar";
import UserPlayingView from "../UserPlayingView.js";

// Context
import PlayerContext from "../context/PlayerContext";
import UserSidebarContext from "../context/UserSidebarContext";


const UserLayout = () => {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const [refreshSidebar, setRefreshSidebar] = useState(false);

    const navigate = useNavigate();
    const { playingViewActive, setPlayingViewActive } = useContext(PlayerContext);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');

        if (storedToken) {
            axios.get(`${BACKEND_URL}/api/role`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            })
                .then(response => {
                    // console.log('Role:', response.data);
                    setToken(storedToken);
                })
                .catch(error => {
                    console.error('Error fetching role:', error);
                    localStorage.removeItem('jwt_token');
                    setToken(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            console.log('Token does not exist');
            navigate('/login');
            setIsLoading(false);
        }
    }, []);

    return (

        <div className="home-page d-flex vh-100">
            <UserSidebarContext.Provider value={{ refreshSidebar, setRefreshSidebar }}>
                <UserSidebar />
                <Container className="g-0 overflow-hidden" fluid>
                    <div className="home-page-content">
                        <Outlet />
                        <MusicPlayer />
                    </div>
                </Container>
                {/* PLAYING VIEW */}
                {playingViewActive ? (
                    <UserPlayingView />
                ) : (
                    <>
                    </>
                )}
            </UserSidebarContext.Provider>
        </div>
    );
}

export default UserLayout;